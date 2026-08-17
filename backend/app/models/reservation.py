import uuid
from datetime import datetime
from enum import StrEnum

from sqlalchemy import UUID, DateTime, Enum, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import CreatedAtMixin, UUIDPkMixin


class ReservationStatus(StrEnum):
    PENDING = "pending"
    APPROVED = "approved"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


class Reservation(UUIDPkMixin, CreatedAtMixin, Base):
    __tablename__ = "reservations"
    # fmt: off
    __table_args__ = (
        Index("ix_reservations_user_id_status", "user_id", "status"),
    )
    # fmt: on

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    status: Mapped[ReservationStatus] = mapped_column(
        Enum(
            ReservationStatus,
            name="reservation_status",
            values_callable=lambda x: [e.value for e in x],
        ),
        nullable=False,
        default=ReservationStatus.PENDING,
    )
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
