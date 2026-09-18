import uuid
from types import SimpleNamespace
from unittest import IsolatedAsyncioTestCase
from unittest.mock import AsyncMock

import numpy as np

from app.schemas.ai_search import AIIndexedBook
from app.services.ai_recommendation_service import AIRecommendationService


class AIRecommendationServiceTests(IsolatedAsyncioTestCase):
    async def test_user_with_borrow_history_gets_personalized_recommendations(self):
        borrowed_id = uuid.uuid4()
        suggested_id = uuid.uuid4()
        suggested_book = AIIndexedBook(
            book_id=suggested_id, title="Suggested book", author="Author", category="Category"
        )
        repository = SimpleNamespace(
            get_user_borrowed_book_ids=AsyncMock(return_value=[borrowed_id]),
            get_all_embeddings=AsyncMock(
                return_value={
                    borrowed_id: np.array([1.0, 0.0]),
                    suggested_id: np.array([1.0, 0.0]),
                }
            ),
            get_books_by_ids=AsyncMock(return_value=[suggested_book]),
        )

        result = await AIRecommendationService(repository).recommend_for_user(
            user_id=uuid.uuid4(), limit=3
        )

        self.assertEqual(result.based_on_books, 1)
        self.assertEqual([item.book_id for item in result.recommendations], [suggested_id])
        repository.get_books_by_ids.assert_awaited_once_with([suggested_id])

    async def test_new_user_gets_popularity_fallback_from_catalog(self):
        popular_id = uuid.uuid4()
        other_id = uuid.uuid4()
        repository = SimpleNamespace(
            get_user_borrowed_book_ids=AsyncMock(return_value=[]),
            get_book_borrow_counts=AsyncMock(return_value={popular_id: 5, other_id: 1}),
            list_books_for_indexing=AsyncMock(
                return_value=[
                    AIIndexedBook(book_id=other_id, title="Other book"),
                    AIIndexedBook(book_id=popular_id, title="Popular book"),
                ]
            ),
        )

        result = await AIRecommendationService(repository).recommend_for_user(
            user_id=uuid.uuid4(), limit=3
        )

        self.assertEqual(result.based_on_books, 0)
        self.assertEqual([item.book_id for item in result.recommendations], [popular_id, other_id])
