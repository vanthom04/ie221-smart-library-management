from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import UUID, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.mixins import UUIDPkMixin

if TYPE_CHECKING:
    from app.models.book import Book
    from app.models.reservation import Reservation


class ReservationItem(UUIDPkMixin, Base):
    __tablename__ = "reservation_items"
    __table_args__ = (
        UniqueConstraint("reservation_id", "book_id", name="uq_reservation_items_reservation_book"),
    )

    reservation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("reservations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    book_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("books.id"), nullable=False, index=True
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    reservation: Mapped[Reservation] = relationship(back_populates="items")
    book: Mapped[Book] = relationship(lazy="joined")
