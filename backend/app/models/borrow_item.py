from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import UUID, Boolean, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import UUIDPkMixin

if TYPE_CHECKING:
    from app.models.book import Book
    from app.models.borrow_record import BorrowRecord


class BorrowItem(UUIDPkMixin, Base):
    __tablename__ = "borrow_items"
    # fmt: off
    __table_args__ = (
        UniqueConstraint("borrow_id", "book_id", name="uq_borrow_items_borrow_book"),
    )
    # fmt: on

    borrow_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("borrow_records.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    book_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("books.id"), nullable=False, index=True
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    returned: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    borrow_record: Mapped[BorrowRecord] = relationship(back_populates="items")
    book: Mapped[Book] = relationship(lazy="joined")
