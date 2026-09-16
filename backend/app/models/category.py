from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

class Category(Base):
    __tablename__ = "categories"

    # Khai báo cột id là số nguyên tự tăng
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)

    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)