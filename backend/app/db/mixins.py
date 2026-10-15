import uuid
from datetime import datetime

from sqlalchemy import UUID, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column


class UUIDPkMixin:
    """Chuẩn hóa khóa UUID tự sinh; bảng trung gian có khóa ghép không dùng mixin này."""

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


class CreatedAtMixin:
    """Dành cho model chỉ cần dấu thời gian tạo và không theo dõi chỉnh sửa."""

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class TimestampMixin(CreatedAtMixin):
    """Bổ sung dấu thời gian cập nhật cho model có thể thay đổi sau khi tạo."""

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
