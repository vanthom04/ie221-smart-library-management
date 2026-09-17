from datetime import datetime
from pgvector.sqlalchemy import Vector
from sqlalchemy import BigInteger, Column, DateTime, Integer, String, Text, func
from app.core.database import Base


class BookEmbedding(Base):
    __tablename__ = "book_embeddings"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    book_id = Column(BigInteger, nullable=False, unique=True, index=True)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(384), nullable=False)
    model_name = Column(String(255), nullable=False)
    embedding_dimension = Column(Integer, nullable=False, default=384)
    content_hash = Column(String(64), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)