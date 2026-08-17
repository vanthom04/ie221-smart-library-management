import uuid
from datetime import datetime
from enum import StrEnum

from sqlalchemy import UUID, DateTime, Enum, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import CreatedAtMixin, UUIDPkMixin


class BorrowStatus(StrEnum):
    BORROWING = "borrowing"
    RETURNED = "returned"
    OVERDUE = "overdue"


class BorrowRecord(UUIDPkMixin, CreatedAtMixin, Base):
    __tablename__ = "borrow_records"
    # fmt: off
    __table_args__ = (
        Index("ix_borrow_records_user_id_status", "user_id", "status"),
    )
    # fmt: on

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    reservation_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("reservations.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    borrow_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    due_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    return_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[BorrowStatus] = mapped_column(
        Enum(BorrowStatus, name="borrow_status", values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        default=BorrowStatus.BORROWING,
    )
