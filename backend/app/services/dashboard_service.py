import uuid
from datetime import UTC, datetime

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.author import Author
from app.models.book import Book
from app.models.book_author import BookAuthor
from app.models.borrow_item import BorrowItem
from app.models.borrow_record import BorrowRecord, BorrowStatus
from app.models.category import Category
from app.models.fine import Fine, PaymentStatus
from app.models.reservation import Reservation, ReservationStatus
from app.models.user import User
from app.schemas.dashboard import (
    ActivityItemResponse,
    AdminQuickStatResponse,
    AdminRecentBorrowResponse,
    BorrowedBookResponse,
    BorrowOverviewResponse,
    BorrowSummaryStatResponse,
    BorrowTrend,
    BorrowTrendPoint,
    CategoryStatResponse,
    DashboardQuickStatResponse,
    DueSoonBookResponse,
)


class DashboardService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_user_quick_stats(self, user_id: uuid.UUID) -> list[DashboardQuickStatResponse]:
        """Lấy dữ liệu thống kê nhanh cho trang cá nhân của user hiện tại."""
        now = datetime.now(UTC)

        # 1. Số sách đang mượn (Trạng thái BORROWING hoặc OVERDUE)
        borrowed_stmt = (
            select(func.coalesce(func.sum(BorrowItem.quantity), 0))
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .where(
                and_(
                    BorrowRecord.user_id == user_id,
                    BorrowRecord.status.in_([BorrowStatus.BORROWING, BorrowStatus.OVERDUE]),
                    ~BorrowItem.returned,
                )
            )
        )
        borrowed_count = (await self.db.execute(borrowed_stmt)).scalar() or 0

        # 2. Số sách quá hạn (Trạng thái BORROWING nhưng due_date nhỏ hơn thời gian hiện tại)
        overdue_stmt = (
            select(func.coalesce(func.sum(BorrowItem.quantity), 0))
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .where(
                and_(
                    BorrowRecord.user_id == user_id,
                    BorrowRecord.status == BorrowStatus.BORROWING,
                    BorrowRecord.due_date < now,
                    ~BorrowItem.returned,
                )
            )
        )
        overdue_count = (await self.db.execute(overdue_stmt)).scalar() or 0

        # 3. Tiền phạt chưa trả (Join qua BorrowRecord và lọc payment_status == UNPAID)
        fines_stmt = (
            select(func.coalesce(func.sum(Fine.amount), 0))
            .select_from(Fine)
            .join(BorrowRecord, Fine.borrow_record_id == BorrowRecord.id)
            .where(
                and_(BorrowRecord.user_id == user_id, Fine.payment_status == PaymentStatus.UNPAID)
            )
        )
        unpaid_fines = (await self.db.execute(fines_stmt)).scalar() or 0
        formatted_fines = f"{unpaid_fines:,.0f}".replace(",", ".")

        # 4. Yêu cầu đặt trước đang chờ
        reservations_stmt = select(func.count(Reservation.id)).where(
            and_(Reservation.user_id == user_id, Reservation.status == ReservationStatus.PENDING)
        )
        reservations_count = (await self.db.execute(reservations_stmt)).scalar() or 0

        return [
            DashboardQuickStatResponse(
                id="borrowed",
                title="Sách đang mượn",
                value=borrowed_count,
                unit="cuốn",
                icon="book",
                tone="blue",
                href="/borrow-history",
            ),
            DashboardQuickStatResponse(
                id="overdue",
                title="Sách quá hạn",
                value=overdue_count,
                unit="cuốn",
                icon="history",
                tone="amber",
                href="/borrow-history",
            ),
            DashboardQuickStatResponse(
                id="fines",
                title="Tiền phạt chưa trả",
                value=formatted_fines,
                unit="đ",
                icon="wallet",
                tone="red",
                href="/borrow-history",
            ),
            DashboardQuickStatResponse(
                id="reservations",
                title="Đặt trước đang chờ",
                value=reservations_count,
                unit="yêu cầu",
                icon="calendar",
                tone="green",
                href="/book-reservation",
            ),
        ]

    async def get_user_borrowed_books(self, user_id: uuid.UUID) -> list[BorrowedBookResponse]:
        """Lấy danh sách các sách đang mượn của user hiện tại (tối đa 5 cuốn)."""
        now = datetime.now(UTC)

        stmt = (
            select(
                Book.id,
                Book.title,
                Book.cover_image_url,
                BorrowRecord.due_date,
                func.string_agg(Author.name, ", ").label("authors_name"),
            )
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .join(Book, BorrowItem.book_id == Book.id)
            .outerjoin(BookAuthor, Book.id == BookAuthor.book_id)
            .outerjoin(Author, BookAuthor.author_id == Author.id)
            .where(
                and_(
                    BorrowRecord.user_id == user_id,
                    BorrowRecord.status == BorrowStatus.BORROWING,
                    ~BorrowItem.returned,
                )
            )
            .group_by(Book.id, BorrowRecord.due_date)
            .limit(5)
        )

        result = await self.db.execute(stmt)
        rows = result.all()

        borrowed_books = []
        for row in rows:
            days_left = (row.due_date - now).days
            borrowed_books.append(
                BorrowedBookResponse(
                    id=str(row.id),
                    title=row.title,
                    author=row.authors_name or "Đang cập nhật",
                    coverUrl=row.cover_image_url or "",
                    dueDate=row.due_date.strftime("%d/%m/%Y"),
                    daysLeft=max(0, days_left),
                )
            )

        return borrowed_books

    async def get_user_recent_activities(self, user_id: uuid.UUID) -> list[ActivityItemResponse]:
        """Lấy danh sách các hoạt động gần đây của user hiện tại (tối đa 5 mục)."""
        activities: list[tuple[datetime, ActivityItemResponse]] = []

        # 1. Lấy lượt trả sách mới nhất
        returned_stmt = (
            select(Book.title, BorrowRecord.return_date, BorrowRecord.id)
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .join(Book, BorrowItem.book_id == Book.id)
            .where(
                and_(
                    BorrowRecord.user_id == user_id,
                    BorrowRecord.status == BorrowStatus.RETURNED,
                    BorrowRecord.return_date.isnot(None),
                )
            )
            .order_by(BorrowRecord.return_date.desc())
            .limit(3)
        )
        for row in (await self.db.execute(returned_stmt)).all():
            activities.append(
                (
                    row.return_date,
                    ActivityItemResponse(
                        id=f"ret-{row.id}",
                        iconTone="green",
                        description="Bạn đã trả sách",
                        bookTitle=row.title,
                        date=row.return_date.strftime("%d/%m/%Y"),
                        time=row.return_date.strftime("%H:%M"),
                    ),
                )
            )

        # 2. Lấy lượt mượn sách gần nhất
        borrow_stmt = (
            select(Book.title, BorrowRecord.borrow_date, BorrowRecord.id)
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .join(Book, BorrowItem.book_id == Book.id)
            .where(BorrowRecord.user_id == user_id)
            .order_by(BorrowRecord.borrow_date.desc())
            .limit(3)
        )
        for row in (await self.db.execute(borrow_stmt)).all():
            activities.append(
                (
                    row.borrow_date,
                    ActivityItemResponse(
                        id=f"bor-{row.id}",
                        iconTone="blue",
                        description="Bạn đã mượn sách",
                        bookTitle=row.title,
                        date=row.borrow_date.strftime("%d/%m/%Y"),
                        time=row.borrow_date.strftime("%H:%M"),
                    ),
                )
            )

        # Trả về danh sách xếp theo thời gian mới nhất (tối đa 5 mục)
        return [
            item for _, item in sorted(activities, key=lambda entry: entry[0], reverse=True)[:5]
        ]

    async def get_user_due_soon_books(self, user_id: uuid.UUID) -> list[DueSoonBookResponse]:
        """Lấy danh sách các sách sắp đến hạn của user hiện tại (tối đa 3 cuốn)."""
        now = datetime.now(UTC)

        stmt = (
            select(
                Book.id,
                Book.title,
                Book.cover_image_url,
                BorrowRecord.due_date,
            )
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .join(Book, BorrowItem.book_id == Book.id)
            .where(
                and_(
                    BorrowRecord.user_id == user_id,
                    BorrowRecord.status == BorrowStatus.BORROWING,
                    BorrowRecord.due_date >= now,
                    ~BorrowItem.returned,
                )
            )
            .order_by(BorrowRecord.due_date.asc())
            .limit(3)
        )

        result = await self.db.execute(stmt)
        rows = result.all()

        due_soon_books = []
        for row in rows:
            days_left = (row.due_date - now).days
            due_soon_books.append(
                DueSoonBookResponse(
                    id=str(row.id),
                    title=row.title,
                    dueDate=row.due_date.strftime("%d/%m/%Y"),
                    daysLeft=max(0, days_left),
                    coverUrl=row.cover_image_url or "",
                )
            )

        return due_soon_books

    async def get_admin_stats(self) -> list[AdminQuickStatResponse]:
        """Lấy dữ liệu tổng quan thống kê cho trang quản trị Admin."""
        now = datetime.now(UTC)

        # 1. Tổng số lượng sách trong kho
        total_books_stmt = select(func.coalesce(func.sum(Book.quantity), 0))
        total_books = (await self.db.execute(total_books_stmt)).scalar() or 0

        # 2. Tổng số người dùng hệ thống
        total_users_stmt = select(func.count(User.id))
        total_users = (await self.db.execute(total_users_stmt)).scalar() or 0

        # 3. Sách đang được mượn
        active_borrows_stmt = (
            select(func.coalesce(func.sum(BorrowItem.quantity), 0))
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .where(
                and_(
                    BorrowRecord.status.in_([BorrowStatus.BORROWING, BorrowStatus.OVERDUE]),
                    ~BorrowItem.returned,
                )
            )
        )
        active_borrows = (await self.db.execute(active_borrows_stmt)).scalar() or 0

        # 4. Sách quá hạn mượn
        overdue_stmt = (
            select(func.coalesce(func.sum(BorrowItem.quantity), 0))
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .where(
                and_(
                    BorrowRecord.status == BorrowStatus.BORROWING,
                    BorrowRecord.due_date < now,
                    ~BorrowItem.returned,
                )
            )
        )
        overdue_books = (await self.db.execute(overdue_stmt)).scalar() or 0

        return [
            AdminQuickStatResponse(
                id="total-books",
                title="Tổng số sách trong hệ thống",
                value=f"{total_books:,.0f}".replace(",", "."),
                unit="cuốn",
                change="Tổng kho hiện tại",
                icon="books",
                tone="blue",
            ),
            AdminQuickStatResponse(
                id="total-users",
                title="Tổng độc giả",
                value=f"{total_users:,.0f}".replace(",", "."),
                unit="người dùng",
                change="Thành viên hệ thống",
                icon="users",
                tone="purple",
            ),
            AdminQuickStatResponse(
                id="active-borrows",
                title="Sách đang được mượn",
                value=active_borrows,
                unit="cuốn",
                change="Đang lưu thông",
                icon="borrowed",
                tone="green",
            ),
            AdminQuickStatResponse(
                id="overdue-books",
                title="Sách quá hạn mượn",
                value=overdue_books,
                unit="cuốn",
                change="Cần xử lý ngay",
                icon="overdue",
                tone="red",
            ),
        ]

    async def get_admin_recent_borrows(self) -> list[AdminRecentBorrowResponse]:
        """Lấy danh sách nhật ký mượn/trả gần đây cho trang Admin."""
        now = datetime.now(UTC)

        stmt = (
            select(
                BorrowRecord.id,
                User.full_name.label("user_name"),
                Book.title.label("book_title"),
                BorrowRecord.borrow_date,
                BorrowRecord.due_date,
                BorrowRecord.status,
            )
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .join(User, BorrowRecord.user_id == User.id)
            .join(Book, BorrowItem.book_id == Book.id)
            .order_by(BorrowRecord.created_at.desc())
            .limit(10)
        )

        result = await self.db.execute(stmt)
        rows = result.all()

        recent_borrows = []
        for row in rows:
            # Xác định trạng thái hiển thị
            if row.status == BorrowStatus.RETURNED:
                status = "returned"
            elif row.status == BorrowStatus.OVERDUE or (
                row.status == BorrowStatus.BORROWING and row.due_date < now
            ):
                status = "overdue"
            else:
                status = "borrowing"

            recent_borrows.append(
                AdminRecentBorrowResponse(
                    id=str(row.id),
                    userName=row.user_name or "Đang cập nhật",
                    bookTitle=row.book_title,
                    borrowDate=row.borrow_date.strftime("%d/%m/%Y"),
                    dueDate=row.due_date.strftime("%d/%m/%Y"),
                    status=status,
                )
            )

        return recent_borrows

    async def get_admin_category_stats(self) -> list[CategoryStatResponse]:
        """Lấy dữ liệu thống kê số lượng mượn sách theo từng danh mục cho trang Admin."""
        # Tính tổng số lượng sách toàn hệ thống đã được mượn để quy ra phần trăm
        total_stmt = select(func.coalesce(func.sum(BorrowItem.quantity), 0)).select_from(BorrowItem)
        total_count = (await self.db.execute(total_stmt)).scalar() or 0
        if total_count == 0:
            total_count = 1  # Tránh lỗi chia cho 0

        # Truy vấn gom nhóm số lượng mượn theo từng danh mục trên toàn hệ thống
        stmt = (
            select(
                Category.name.label("category_name"),
                func.coalesce(func.sum(BorrowItem.quantity), 0).label("count"),
            )
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .join(Book, BorrowItem.book_id == Book.id)
            .join(Category, Book.category_id == Category.id)
            .group_by(Category.id, Category.name)
        )

        result = (await self.db.execute(stmt)).all()

        stats = []
        for row in result:
            count = row._mapping["count"]
            percentage = round(float(count) / float(total_count) * 100)

            category_key = self._map_category_key(row.category_name)

            stats.append(
                CategoryStatResponse(
                    categoryKey=category_key,
                    label=row.category_name,
                    count=count,
                    percentage=percentage,
                )
            )

        return stats

    def _map_category_key(self, name: str) -> str:
        """Chuyển đổi tên danh mục sang key chuẩn để sử dụng trong frontend."""
        mapping = {
            "Kỹ năng sống": "lifeSkills",
            "Kinh tế - Quản trị": "economics",
            "Văn học": "literature",
            "Khoa học - Công nghệ": "science",
            "Lịch sử - Tiểu sử": "history",
        }
        return mapping.get(name, name.lower().replace(" ", "-"))

    async def get_admin_borrow_summary(self) -> list[BorrowSummaryStatResponse]:
        """Lấy dữ liệu tổng quan mượn sách toàn hệ thống cho Admin."""
        # 1. Tổng số lượt mượn toàn hệ thống
        total_borrows_stmt = select(func.count(BorrowRecord.id))
        total_borrows = (await self.db.execute(total_borrows_stmt)).scalar() or 0

        # 2. Tổng số sách đã trả toàn hệ thống
        returned_books_stmt = (
            select(func.coalesce(func.sum(BorrowItem.quantity), 0))
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .where(BorrowItem.returned)
        )
        returned_books = (await self.db.execute(returned_books_stmt)).scalar() or 0

        # 3. Tính tỷ lệ trả sách đúng hạn trên toàn hệ thống
        total_returned_stmt = select(func.count(BorrowRecord.id)).where(
            BorrowRecord.status == BorrowStatus.RETURNED
        )
        total_returned = (await self.db.execute(total_returned_stmt)).scalar() or 0

        on_time_stmt = select(func.count(BorrowRecord.id)).where(
            and_(
                BorrowRecord.status == BorrowStatus.RETURNED,
                BorrowRecord.return_date <= BorrowRecord.due_date,
            )
        )
        on_time_count = (await self.db.execute(on_time_stmt)).scalar() or 0
        rate = (on_time_count / total_returned * 100) if total_returned > 0 else 0.0

        return [
            BorrowSummaryStatResponse(
                label="Tổng số lượt mượn", value=str(total_borrows), unit="lượt"
            ),
            BorrowSummaryStatResponse(label="Sách đã trả", value=str(returned_books), unit="cuốn"),
            BorrowSummaryStatResponse(
                label="Tỉ lệ đúng hạn",
                value=f"{rate:.1f}%",
                trend=BorrowTrend(value="5%", direction="up"),
            ),
        ]

    async def get_admin_borrow_overview(self, period: str) -> BorrowOverviewResponse:
        """Lấy dữ liệu tổng quan mượn sách toàn hệ thống cho Admin theo khoảng thời gian."""
        months_map = {"3m": 3, "6m": 6, "12m": 12}
        months_count = months_map.get(period, 3)

        # 1. Sử dụng UTC timezone-aware để tránh lỗi naive datetime
        now = datetime.now(UTC)

        # 2. Xây dựng danh sách các tháng cần thống kê & mốc bắt đầu
        months_to_fetch = []
        for i in range(months_count - 1, -1, -1):
            total_months = now.year * 12 + (now.month - 1) - i
            target_year = total_months // 12
            target_month = (total_months % 12) + 1
            months_to_fetch.append((target_year, target_month))

        start_year, start_month = months_to_fetch[0]
        start_date = datetime(start_year, start_month, 1, tzinfo=UTC)

        # 3. Gộp thành 1 query duy nhất bằng GROUP BY (Tối ưu N+1 Query)
        stmt = (
            select(
                func.extract("year", BorrowRecord.borrow_date).label("year"),
                func.extract("month", BorrowRecord.borrow_date).label("month"),
                func.count(BorrowRecord.id).label("count"),
            )
            .where(BorrowRecord.borrow_date >= start_date)
            .group_by("year", "month")
        )

        results = (await self.db.execute(stmt)).all()

        # Map kết quả từ DB thành dictionary {(year, month): count}
        counts_map: dict[tuple[int, int], int] = {
            (int(r.year), int(r.month)): int(r.count) for r in results
        }

        # 4. Map kết quả ra danh sách trả về frontend
        trend_data: list[BorrowTrendPoint] = []
        for year, month in months_to_fetch:
            month_label = f"{month:02d}/{year}"
            count = counts_map.get((year, month), 0)
            trend_data.append(BorrowTrendPoint(month=month_label, count=float(count)))

        stats = await self.get_admin_borrow_summary()

        return BorrowOverviewResponse(stats=stats, trend=trend_data)
