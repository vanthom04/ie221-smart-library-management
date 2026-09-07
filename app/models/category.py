from sqlalchemy import Column, Integer, String
from app.db.base import Base  # Import Base từ cấu hình db của dự án


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)