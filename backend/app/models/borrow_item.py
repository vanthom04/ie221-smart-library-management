import uuid

from sqlalchemy import UUID, Boolean, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import UUIDPkMixin


class BorrowItem(UUIDPkMixin, Base):
    __tablename__ = "borrow_items"
    __table_args__ = (UniqueConstraint("borrow_id", "book_id", name="uq_borrow_items_borrow_book"),)

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

    borrow_record: Mapped["BorrowRecord"] = relationship(back_populates="items")  # noqa: F821
    book: Mapped["Book"] = relationship(lazy="joined")  # noqa: F821
