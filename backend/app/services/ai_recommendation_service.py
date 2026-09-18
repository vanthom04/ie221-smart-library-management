import uuid

import numpy as np

from app.repositories.ai_search_repository import AISearchRepository
from app.schemas.ai_search import AIRecommendationItem, AIRecommendationResponse


class AIRecommendationService:
    """Gợi ý sách dựa trên embedding của lịch sử mượn."""

    def __init__(self, ai_search_repository: AISearchRepository) -> None:
        self._ai_search = ai_search_repository

    async def recommend_for_user(
        self, *, user_id: uuid.UUID, limit: int
    ) -> AIRecommendationResponse:
        borrowed_book_ids = await self._ai_search.get_user_borrowed_book_ids(user_id)

        if not borrowed_book_ids:
            recommendations = await self._popular_recommendations(limit=limit)
            return AIRecommendationResponse(based_on_books=0, recommendations=recommendations)

        embeddings = await self._ai_search.get_all_embeddings()

        history_vectors = [
            embeddings[book_id] for book_id in borrowed_book_ids if book_id in embeddings
        ]

        if not history_vectors:
            recommendations = await self._popular_recommendations(
                limit=limit, exclude_book_ids=set(borrowed_book_ids)
            )
            return AIRecommendationResponse(
                based_on_books=len(borrowed_book_ids), recommendations=recommendations
            )

        centroid = np.mean(history_vectors, axis=0)
        norm = np.linalg.norm(centroid)

        if norm == 0:
            recommendations = await self._popular_recommendations(
                limit=limit, exclude_book_ids=set(borrowed_book_ids)
            )
            return AIRecommendationResponse(
                based_on_books=len(borrowed_book_ids), recommendations=recommendations
            )

        centroid = centroid / norm
        excluded = set(borrowed_book_ids)
        candidates: list[tuple[uuid.UUID, float]] = []

        for book_id, vector in embeddings.items():
            if book_id in excluded:
                continue

            vector_norm = np.linalg.norm(vector)

            if vector_norm == 0:
                continue

            normalized_vector = vector / vector_norm
            similarity = float(np.dot(centroid, normalized_vector))
            candidates.append((book_id, similarity))

        candidates.sort(key=lambda item: item[1], reverse=True)
        top_candidates = candidates[:limit]

        if not top_candidates:
            recommendations = await self._popular_recommendations(
                limit=limit, exclude_book_ids=excluded
            )
            return AIRecommendationResponse(
                based_on_books=len(borrowed_book_ids), recommendations=recommendations
            )

        metadata = await self._ai_search.get_books_by_ids(
            [book_id for book_id, _ in top_candidates]
        )
        metadata_by_id = {book.book_id: book for book in metadata}
        recommendations: list[AIRecommendationItem] = []

        for book_id, score in top_candidates:
            book = metadata_by_id.get(book_id)

            if book is None:
                continue

            recommendations.append(
                AIRecommendationItem(
                    rank=len(recommendations) + 1,
                    book_id=book.book_id,
                    title=book.title,
                    isbn=book.isbn,
                    author=book.author,
                    category=book.category,
                    publisher=book.publisher,
                    score=round(score, 4),
                    reason=("Dựa trên các sách bạn đã mượn"),
                )
            )

        return AIRecommendationResponse(
            based_on_books=len(borrowed_book_ids), recommendations=recommendations
        )

    async def _popular_recommendations(
        self, *, limit: int, exclude_book_ids: set[uuid.UUID] | None = None
    ) -> list[AIRecommendationItem]:
        excluded = exclude_book_ids or set()

        borrow_counts = await self._ai_search.get_book_borrow_counts()
        books = await self._ai_search.list_books_for_indexing()

        candidates = [book for book in books if book.book_id not in excluded]
        candidates.sort(
            key=lambda book: (
                borrow_counts.get(book.book_id, 0),
                book.title,
            ),
            reverse=True,
        )

        candidates = candidates[:limit]

        max_count = max((borrow_counts.get(book.book_id, 0) for book in candidates), default=0)
        recommendations: list[AIRecommendationItem] = []

        for book in candidates:
            borrow_count = borrow_counts.get(book.book_id, 0)
            score = borrow_count / max_count if max_count > 0 else 0.0

            recommendations.append(
                AIRecommendationItem(
                    rank=len(recommendations) + 1,
                    book_id=book.book_id,
                    title=book.title,
                    isbn=book.isbn,
                    author=book.author,
                    category=book.category,
                    publisher=book.publisher,
                    score=round(score, 4),
                    reason=("Sách phổ biến trong thư viện"),
                )
            )

        return recommendations
