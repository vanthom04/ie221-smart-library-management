import uuid

from sqlalchemy import UUID, ForeignKey, Text
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import CreatedAtMixin, UUIDPkMixin


class AiSearchLog(UUIDPkMixin, CreatedAtMixin, Base):
    __tablename__ = "ai_search_logs"

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    query_text: Mapped[str] = mapped_column(Text, nullable=False)
    result_book_ids: Mapped[list | None] = mapped_column(postgresql.JSONB, nullable=True)
