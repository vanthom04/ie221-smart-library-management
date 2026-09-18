import uuid
from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from unittest import IsolatedAsyncioTestCase, TestCase
from unittest.mock import AsyncMock, Mock, patch

from fastapi.testclient import TestClient

from app.api.deps import require_admin
from app.api.v1.dashboard.deps import get_dashboard_service
from app.api.v1.dashboard.router import admin_router
from app.main import app
from app.models.borrow_record import BorrowStatus
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

    def test_recent_borrows_api_returns_overdue_for_overdue_record(self):
        now = datetime.now(UTC)
        row = SimpleNamespace(
            id=uuid.uuid4(),
            user_name="Reader",
            book_title="Book",
            borrow_date=now - timedelta(days=3),
            due_date=now + timedelta(days=3),
            status=BorrowStatus.OVERDUE,
        )
        db = SimpleNamespace(execute=AsyncMock(return_value=rows_result([row])))
        app.dependency_overrides[require_admin] = lambda: None
        app.dependency_overrides[get_dashboard_service] = lambda: DashboardService(db)

        try:
            with TestClient(app) as client:
                response = client.get("/api/v1/dashboard/admin/recent-borrows")
        finally:
            app.dependency_overrides.clear()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["status"], "overdue")


class DashboardServiceTests(IsolatedAsyncioTestCase):
    async def test_admin_recent_borrows_statuses(self):
        now = datetime.now(UTC)
        statuses_and_due_dates = [
            (BorrowStatus.RETURNED, now - timedelta(days=1)),
            (BorrowStatus.OVERDUE, now + timedelta(days=1)),
            (BorrowStatus.BORROWING, now - timedelta(days=1)),
            (BorrowStatus.BORROWING, now + timedelta(days=1)),
        ]
        rows = [
            SimpleNamespace(
                id=uuid.uuid4(),
                user_name="Reader",
                book_title="Book",
                borrow_date=now - timedelta(days=7),
                due_date=due_date,
                status=status,
            )
            for status, due_date in statuses_and_due_dates
        ]
        db = SimpleNamespace(execute=AsyncMock(return_value=rows_result(rows)))

        borrows = await DashboardService(db).get_admin_recent_borrows()

        self.assertEqual(
            [borrow.status for borrow in borrows],
            ["returned", "overdue", "overdue", "borrowing"],
        )

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
