import uuid
from types import SimpleNamespace
from unittest import IsolatedAsyncioTestCase, TestCase
from unittest.mock import AsyncMock, Mock, patch

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from app.api.deps import require_admin
from app.api.v1.authors import router as authors_router
from app.api.v1.books import router as books_router
from app.api.v1.categories import delete_category as delete_category_route
from app.api.v1.categories import router as categories_router
from app.api.v1.publishers import router as publishers_router
from app.repositories.book import get_books
from app.repositories.category import delete_category


class CatalogAuthorizationTests(TestCase):
    def test_catalog_writes_require_admin_and_reads_remain_public(self):
        for router in (books_router, authors_router, categories_router, publishers_router):
            for route in router.routes:
                dependencies = {dependency.call for dependency in route.dependant.dependencies}
                if route.methods & {"POST", "PUT", "DELETE"}:
                    self.assertIn(require_admin, dependencies, route.path)
                elif "GET" in route.methods:
                    self.assertNotIn(require_admin, dependencies, route.path)


class CatalogRepositoryTests(IsolatedAsyncioTestCase):
    async def test_get_books_populates_all_author_ids_with_one_query(self):
        first = SimpleNamespace(id=uuid.uuid4())
        second = SimpleNamespace(id=uuid.uuid4())
        author_ids = [uuid.uuid4(), uuid.uuid4()]
        books_result = Mock()
        books_result.scalars.return_value.all.return_value = [first, second]
        authors_result = Mock()
        authors_result.all.return_value = [(first.id, author_ids[0]), (first.id, author_ids[1])]
        db = SimpleNamespace(execute=AsyncMock(side_effect=[books_result, authors_result]))

        books = await get_books(db)

        self.assertEqual(books, [first, second])
        self.assertEqual(first.author_ids, author_ids)
        self.assertEqual(first.author_id, author_ids[0])
        self.assertEqual(second.author_ids, [])
        self.assertIsNone(second.author_id)
        self.assertEqual(db.execute.await_count, 2)

    async def test_delete_category_rolls_back_and_route_returns_conflict(self):
        category_id = uuid.uuid4()
        db = SimpleNamespace(
            delete=AsyncMock(),
            commit=AsyncMock(side_effect=IntegrityError("delete", {}, Exception("foreign key"))),
            rollback=AsyncMock(),
        )
        with patch(
            "app.repositories.category.get_category_by_id", new=AsyncMock(return_value=object())
        ):
            with self.assertRaisesRegex(ValueError, "đang có sách"):
                await delete_category(db, category_id)
        db.rollback.assert_awaited_once()

        with patch(
            "app.api.v1.categories.crud.delete_category",
            new=AsyncMock(side_effect=ValueError("đang có sách")),
        ):
            with self.assertRaises(HTTPException) as caught:
                await delete_category_route(category_id, db, None)
        self.assertEqual(caught.exception.status_code, 409)
