"""extend borrowing core workflow

Revision ID: 3f21d9a7c4b2
Revises: 8ab5704e174b
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "3f21d9a7c4b2"
down_revision: str | None = "8ab5704e174b"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # PostgreSQL requires enum values to be committed before they can be used.
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE reservation_status ADD VALUE IF NOT EXISTS 'rejected'")
        op.execute("ALTER TYPE reservation_status ADD VALUE IF NOT EXISTS 'fulfilled'")

    op.add_column("reservations", sa.Column("reviewed_at", sa.DateTime(timezone=True)))
    op.add_column("reservations", sa.Column("reviewed_by", sa.UUID()))
    op.add_column("reservations", sa.Column("rejection_reason", sa.String(length=500)))
    op.add_column("reservations", sa.Column("fulfilled_at", sa.DateTime(timezone=True)))
    op.create_foreign_key(
        op.f("fk_reservations_reviewed_by_users"),
        "reservations",
        "users",
        ["reviewed_by"],
        ["id"],
        ondelete="SET NULL",
    )

    op.add_column(
        "borrow_records",
        sa.Column("renewal_count", sa.Integer(), server_default="0", nullable=False),
    )
    op.add_column("borrow_records", sa.Column("renewed_at", sa.DateTime(timezone=True)))

    op.create_unique_constraint(
        "uq_reservation_items_reservation_book",
        "reservation_items",
        ["reservation_id", "book_id"],
    )
    op.create_unique_constraint("uq_borrow_items_borrow_book", "borrow_items", ["borrow_id", "book_id"])
    op.create_check_constraint("reservation_item_quantity_positive", "reservation_items", "quantity > 0")
    op.create_check_constraint("borrow_item_quantity_positive", "borrow_items", "quantity > 0")
    op.create_check_constraint(
        "book_quantities_valid",
        "books",
        "quantity >= 0 AND available_quantity >= 0 AND available_quantity <= quantity",
    )


def downgrade() -> None:
    op.drop_constraint("ck_books_book_quantities_valid", "books", type_="check")
    op.drop_constraint("ck_borrow_items_borrow_item_quantity_positive", "borrow_items", type_="check")
    op.drop_constraint(
        "ck_reservation_items_reservation_item_quantity_positive",
        "reservation_items",
        type_="check",
    )
    op.drop_constraint("uq_borrow_items_borrow_book", "borrow_items", type_="unique")
    op.drop_constraint("uq_reservation_items_reservation_book", "reservation_items", type_="unique")
    op.drop_column("borrow_records", "renewed_at")
    op.drop_column("borrow_records", "renewal_count")
    op.drop_constraint(op.f("fk_reservations_reviewed_by_users"), "reservations", type_="foreignkey")
    op.drop_column("reservations", "fulfilled_at")
    op.drop_column("reservations", "rejection_reason")
    op.drop_column("reservations", "reviewed_by")
    op.drop_column("reservations", "reviewed_at")
    # PostgreSQL cannot safely remove enum values in-place. They remain harmless
    # after downgrade and can be removed by recreating the enum in a maintenance migration.
