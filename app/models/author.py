from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base
class Author(Base):
    __tablename__ = "authors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    bio = Column(Text, nullable=True)  # Tiểu sử tác giả