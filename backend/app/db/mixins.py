import uuid
from datetime import datetime

from sqlalchemy import UUID, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column


class UUIDPkMixin:
    """UUID Primary Key tự sinh - dùng cho mọi model TRỪ bảng trung gian N-N có PK composite."""

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


class CreatedAtMixin:
    """created_at - dùng cho model chỉ cần ghi nhận thời điểm tạo, không theo dõi chỉnh sửa."""

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class TimestampMixin(CreatedAtMixin):
    """created_at + updated_at - dùng cho model có thể bị chỉnh sửa sau khi tạo."""

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
