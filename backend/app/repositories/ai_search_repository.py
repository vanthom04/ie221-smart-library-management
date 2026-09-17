import uuid
from collections.abc import AsyncGenerator, Sequence
from contextlib import asynccontextmanager

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.author import Author
from app.models.book import Book
from app.models.book_author import BookAuthor
from app.models.book_embedding import BookEmbedding
from app.models.category import Category
from app.models.publisher import Publisher
from app.schemas.ai_search import AIIndexedBook


class AISearchRepository:
    """Data access cho AI indexing semantic search."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    @asynccontextmanager
    async def transaction(self) -> AsyncGenerator[None]:
        try:
            yield
            await self._session.commit()
        except Exception:
            await self._session.rollback()
            raise

    def _book_metadata_statement(self):
        authors = func.string_agg(Author.name, ", ").label("author")

        return (
            select(
                Book.id.label("book_id"),
                Book.title,
                Book.isbn,
                Book.description,
                Category.name.label("category"),
                Publisher.name.label("publisher"),
                authors,
            )
            .join(Category, Category.id == Book.category_id)
            .outerjoin(Publisher, Publisher.id == Book.publisher_id)
            .outerjoin(BookAuthor, BookAuthor.book_id == Book.id)
            .outerjoin(Author, Author.id == BookAuthor.author_id)
            .group_by(
                Book.id,
                Book.title,
                Book.isbn,
                Book.description,
                Category.name,
                Publisher.name,
            )
        )

    @staticmethod
    def _row_to_indexed_book(row) -> AIIndexedBook:
        return AIIndexedBook(
            book_id=row.book_id,
            title=row.title,
            isbn=row.isbn,
            description=row.description,
            author=row.author,
            category=row.category,
            publisher=row.publisher,
        )

    async def list_books_for_indexing(self) -> list[AIIndexedBook]:
        result = await self._session.execute(self._book_metadata_statement())
        return [self._row_to_indexed_book(row) for row in result.all()]

    async def get_books_by_ids(
        self,
        book_ids: Sequence[uuid.UUID],
    ) -> list[AIIndexedBook]:
        if not book_ids:
            return []

        statement = self._book_metadata_statement().where(Book.id.in_(book_ids))
        result = await self._session.execute(statement)
        return [self._row_to_indexed_book(row) for row in result.all()]

    async def get_embedding_hashes(self) -> dict[uuid.UUID, str]:
        statement = select(BookEmbedding.book_id, BookEmbedding.content_hash)
        result = await self._session.execute(statement)
        return {row.book_id: row.content_hash for row in result.all()}

    async def upsert_embedding(
        self,
        *,
        book_id: uuid.UUID,
        content: str,
        embedding: list[float],
        model_name: str,
        content_hash: str,
    ) -> None:
        statement = select(BookEmbedding).where(BookEmbedding.book_id == book_id)
        existing = (await self._session.execute(statement)).scalar_one_or_none()

        if existing is None:
            self._session.add(
                BookEmbedding(
                    book_id=book_id,
                    content=content,
                    embedding=embedding,
                    model_name=model_name,
                    content_hash=content_hash,
                )
            )
        else:
            existing.content = content
            existing.embedding = embedding
            existing.model_name = model_name
            existing.content_hash = content_hash

        await self._session.flush()

    async def search_by_vector(
        self,
        vector: Sequence[float],
        limit: int,
    ) -> list[tuple[uuid.UUID, float]]:
        distance = BookEmbedding.embedding.cosine_distance(list(vector))

        statement = (
            select(
                BookEmbedding.book_id,
                (1 - distance).label("similarity"),
            )
            .order_by(distance.asc())
            .limit(limit)
        )

        result = await self._session.execute(statement)
        return [(row.book_id, float(row.similarity)) for row in result.all()]
