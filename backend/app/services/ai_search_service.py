import asyncio

from app.repositories.ai_search_repository import AISearchRepository
from app.schemas.ai_search import AISearchResult
from app.services.ai_embedding_service import AIEmbeddingService


class AISearchService:
    """Semantic search trên book embeddings."""

    def __init__(
        self,
        repository: AISearchRepository,
        embedding_service: AIEmbeddingService,
    ) -> None:
        self._repository = repository
        self._embedding_service = embedding_service

    async def search(
        self,
        *,
        query: str,
        limit: int,
    ) -> list[AISearchResult]:
        query_vector = await asyncio.to_thread(self._embedding_service.embed_query, query)

        matches = await self._repository.search_by_vector(query_vector.tolist(), limit)

        if not matches:
            return []

        book_ids = [book_id for book_id, _ in matches]
        books = await self._repository.get_books_by_ids(book_ids)
        books_by_id = {book.book_id: book for book in books}
        scores = dict(matches)

        results: list[AISearchResult] = []
        for book_id in book_ids:
            book = books_by_id.get(book_id)
            if book is None:
                continue

            results.append(
                AISearchResult(
                    book_id=book.book_id,
                    title=book.title,
                    isbn=book.isbn,
                    author=book.author,
                    category=book.category,
                    publisher=book.publisher,
                    score=round(scores[book_id], 4),
                )
            )

        return results
