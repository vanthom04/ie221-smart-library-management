import uuid

from sqlalchemy import UUID, ForeignKey, Index, Integer, SmallInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import TimestampMixin, UUIDPkMixin


class Book(UUIDPkMixin, TimestampMixin, Base):
    __tablename__ = "books"
    __table_args__ = (
        Index(
            "ix_books_title_trgm",
            "title",
            postgresql_using="gin",
            postgresql_ops={"title": "gin_trgm_ops"},
        ),
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    isbn: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)

    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False, index=True
    )
    publisher_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("publishers.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    available_quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    published_year: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    cover_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    cover_image_storage_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
