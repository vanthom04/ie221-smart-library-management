import uuid
from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from unittest import IsolatedAsyncioTestCase, TestCase
from unittest.mock import AsyncMock, Mock, patch

from app.api.v1.dashboard.router import admin_router
from app.schemas.dashboard import BorrowOverviewResponse
from app.services.dashboard_service import DashboardService


def rows_result(rows):
    result = Mock()
    result.all.return_value = rows
    return result


class DashboardRoutesTests(TestCase):
    def test_invalid_pending_request_routes_are_removed(self):
        paths = {route.path for route in admin_router.routes}
        self.assertNotIn("/dashboard/admin/pending-requests", paths)
        self.assertNotIn("/dashboard/admin/requests/{record_id}/approve", paths)
        self.assertNotIn("/dashboard/admin/requests/{record_id}/reject", paths)


class DashboardServiceTests(IsolatedAsyncioTestCase):
    async def test_recent_activities_sort_by_datetime_across_months(self):
        returned = SimpleNamespace(
            id=uuid.uuid4(), title="Returned", return_date=datetime(2026, 8, 31, 23, 0, tzinfo=UTC)
        )
        borrowed = SimpleNamespace(
            id=uuid.uuid4(), title="Borrowed", borrow_date=datetime(2026, 9, 1, 1, 0, tzinfo=UTC)
        )
        db = SimpleNamespace(
            execute=AsyncMock(side_effect=[rows_result([returned]), rows_result([borrowed])])
        )

        activities = await DashboardService(db).get_user_recent_activities(uuid.uuid4())

        self.assertEqual([item.bookTitle for item in activities], ["Borrowed", "Returned"])

    async def test_borrowed_books_handles_timezone_aware_due_date(self):
        row = SimpleNamespace(
            id=uuid.uuid4(),
            title="Book",
            authors_name="Author",
            cover_image_url=None,
            due_date=datetime.now(UTC) + timedelta(days=3),
        )
        db = SimpleNamespace(execute=AsyncMock(return_value=rows_result([row])))

        books = await DashboardService(db).get_user_borrowed_books(uuid.uuid4())

        self.assertEqual(books[0].title, "Book")
        self.assertGreaterEqual(books[0].daysLeft, 2)

    async def test_borrow_overview_uses_count_column(self):
        row = SimpleNamespace(year=2026, month=9, count=4)
        db = SimpleNamespace(execute=AsyncMock(return_value=rows_result([row])))
        service = DashboardService(db)
        service.get_admin_borrow_summary = AsyncMock(return_value=[])

        with patch("app.services.dashboard_service.datetime") as clock:
            clock.now.return_value = datetime(2026, 9, 18, tzinfo=UTC)
            clock.side_effect = datetime
            overview = await service.get_admin_borrow_overview("3m")

        self.assertIsInstance(overview, BorrowOverviewResponse)
        self.assertEqual(
            [(point.month, point.count) for point in overview.trend],
            [("07/2026", 0), ("08/2026", 0), ("09/2026", 4)],
        )
