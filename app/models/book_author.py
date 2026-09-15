from sqlalchemy import ForeignKey, Index, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

class BookAuthor(Base):
    __tablename__ = "book_authors"
    # fmt: off
    __table_args__ = (
        Index("ix_book_authors_author_id", "author_id"),
    )
    # fmt: on

    # Đổi toàn bộ Khóa ngoại sang Integer
    book_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("books.id", ondelete="CASCADE"), primary_key=True
    )
    author_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("authors.id", ondelete="CASCADE"), primary_key=True
    )