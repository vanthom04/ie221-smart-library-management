"""create book_embeddings table

Revision ID: 3d0623868edb
Revises: 
Create Date: 2026-03-01 00:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

revision: str = "'8ab5704e174b"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    op.create_table(
        "book_embeddings",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("book_id", sa.BigInteger(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("embedding", Vector(384), nullable=False),
        sa.Column("model_name", sa.String(length=255), nullable=False),
        sa.Column("embedding_dimension", sa.Integer(), nullable=False, server_default="384"),
        sa.Column("content_hash", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("book_id"),
    )
    op.create_index("ix_book_embeddings_book_id", "book_embeddings", ["book_id"], unique=True)
    op.create_index("ix_book_embeddings_content_hash", "book_embeddings", ["content_hash"], unique=False)
    op.execute(
        "CREATE INDEX ix_book_embeddings_vector ON book_embeddings "
        "USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);"
    )


def downgrade() -> None:
    op.drop_index("ix_book_embeddings_vector", table_name="book_embeddings")
    op.drop_index("ix_book_embeddings_content_hash", table_name="book_embeddings")
    op.drop_index("ix_book_embeddings_book_id", table_name="book_embeddings")
    op.drop_table("book_embeddings")