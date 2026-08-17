import uuid

from sqlalchemy import UUID, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class BookAuthor(Base):
    __tablename__ = "book_authors"
    # fmt: off
    __table_args__ = (
        Index("ix_book_authors_author_id", "author_id"),
    )
    # fmt: on

    book_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("books.id", ondelete="CASCADE"), primary_key=True
    )
    author_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("authors.id", ondelete="CASCADE"), primary_key=True
    )
