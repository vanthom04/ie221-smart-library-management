from datetime import datetime
from typing import List
import uuid
from fastapi import HTTPException, status
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.borrow_item import BorrowItem
from app.models.user import User
from app.models.book import Book
from app.models.book_author import BookAuthor
from app.models.author import Author
from app.models.borrow_record import BorrowRecord, BorrowStatus
from app.models.fine import Fine, PaymentStatus
from app.models.reservation import Reservation, ReservationStatus
from app.schemas.dashboard import ActivityItemResponse, AdminPendingRequestResponse, AdminQuickStatResponse, DashboardQuickStatResponse, BorrowedBookResponse, DueSoonBookResponse, AdminRecentBorrowResponse, CategoryStatResponse, BorrowSummaryStatResponse, BorrowTrend, BorrowOverviewResponse, BorrowTrendPoint

from app.models.category import Category


class DashboardService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_user_quick_stats(self, user_id: uuid.UUID) -> list[DashboardQuickStatResponse]:
        '''Lấy dữ liệu thống kê nhanh cho trang cá nhân của user hiện tại.'''
        now = datetime.now()

        # 1. Số sách đang mượn (Trạng thái BORROWING hoặc OVERDUE)
        borrowed_stmt = (
            select(func.coalesce(func.sum(BorrowItem.quantity), 0))
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .where(
                and_(
                    BorrowRecord.user_id == user_id,
                    BorrowRecord.status.in_([BorrowStatus.BORROWING, BorrowStatus.OVERDUE]),
                    BorrowItem.returned == False
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
                    BorrowItem.returned == False
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
                and_(
                    BorrowRecord.user_id == user_id,
                    Fine.payment_status == PaymentStatus.UNPAID
                )
            )
        )
        unpaid_fines = (await self.db.execute(fines_stmt)).scalar() or 0
        formatted_fines = f"{unpaid_fines:,.0f}".replace(",", ".")

        # 4. Yêu cầu đặt trước đang chờ
        reservations_stmt = select(func.count(Reservation.id)).where(
            and_(
                Reservation.user_id == user_id,
                Reservation.status == ReservationStatus.PENDING
            )
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
                href="/borrow-history"
            ),
            DashboardQuickStatResponse(
                id="overdue",
                title="Sách quá hạn",
                value=overdue_count,
                unit="cuốn",
                icon="history",
                tone="amber",
                href="/borrow-history"
            ),
            DashboardQuickStatResponse(
                id="fines",
                title="Tiền phạt chưa trả",
                value=formatted_fines,
                unit="đ",
                icon="wallet",
                tone="red",
                href="/borrow-history"
            ),
            DashboardQuickStatResponse(
                id="reservations",
                title="Đặt trước đang chờ",
                value=reservations_count,
                unit="yêu cầu",
                icon="calendar",
                tone="green",
                href="/book-reservation"
            )
        ]

    async def get_user_borrowed_books(self, user_id: uuid.UUID) -> list[BorrowedBookResponse]:
        now = datetime.now()

        stmt = (
            select(
                Book.id,
                Book.title,
                Book.cover_image_url,
                BorrowRecord.due_date,
                func.string_agg(Author.name, ", ").label("authors_name")
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
                    BorrowItem.returned == False
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
                    daysLeft=max(0, days_left)
                )
            )

        return borrowed_books

    async def get_user_recent_activities(self, user_id: uuid.UUID) -> list[ActivityItemResponse]:
        activities: list[ActivityItemResponse] = []

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
                    BorrowRecord.return_date.isnot(None)
                )
            )
            .order_by(BorrowRecord.return_date.desc())
            .limit(3)
        )
        for row in (await self.db.execute(returned_stmt)).all():
            activities.append(
                ActivityItemResponse(
                    id=f"ret-{row.id}",
                    iconTone="green",
                    description="Bạn đã trả sách",
                    bookTitle=row.title,
                    date=row.return_date.strftime("%d/%m/%Y"),
                    time=row.return_date.strftime("%H:%M")
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
                ActivityItemResponse(
                    id=f"bor-{row.id}",
                    iconTone="blue",
                    description="Bạn đã mượn sách",
                    bookTitle=row.title,
                    date=row.borrow_date.strftime("%d/%m/%Y"),
                    time=row.borrow_date.strftime("%H:%M")
                )
            )

        # Trả về danh sách xếp theo thời gian mới nhất (tối đa 5 mục)
        return sorted(activities, key=lambda x: (x.date, x.time), reverse=True)[:5]

    async def get_user_due_soon_books(self, user_id: uuid.UUID) -> list[DueSoonBookResponse]:
        now = datetime.now()

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
                    BorrowItem.returned == False
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
                    coverUrl=row.cover_image_url or ""
                )
            )

        return due_soon_books

    async def get_admin_stats(self) -> list[AdminQuickStatResponse]:
        now = datetime.now()

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
                    BorrowItem.returned == False
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
                    BorrowItem.returned == False
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
                tone="blue"
            ),
            AdminQuickStatResponse(
                id="total-users",
                title="Tổng độc giả",
                value=f"{total_users:,.0f}".replace(",", "."),
                unit="người dùng",
                change="Thành viên hệ thống",
                icon="users",
                tone="purple"
            ),
            AdminQuickStatResponse(
                id="active-borrows",
                title="Sách đang được mượn",
                value=active_borrows,
                unit="cuốn",
                change="Đang lưu thông",
                icon="borrowed",
                tone="green"
            ),
            AdminQuickStatResponse(
                id="overdue-books",
                title="Sách quá hạn mượn",
                value=overdue_books,
                unit="cuốn",
                change="Cần xử lý ngay",
                icon="overdue",
                tone="red"
            )
        ]

    async def get_admin_pending_requests(self) -> list[AdminPendingRequestResponse]:
        stmt = (
            select(
                BorrowRecord.id,
                User.full_name.label("user_name"),
                Book.title.label("book_title"),
                BorrowRecord.borrow_date,
                BorrowRecord.status
            )
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .join(User, BorrowRecord.user_id == User.id)
            .join(Book, BorrowItem.book_id == Book.id)
            .where(BorrowRecord.status == BorrowStatus.RETURNED) # Chỉ lấy các yêu cầu đang chờ
            .order_by(BorrowRecord.created_at.desc())
            .limit(10)
        )
        
        result = await self.db.execute(stmt)
        rows = result.all()

        pending_requests = []
        for row in rows:
            pending_requests.append(
                AdminPendingRequestResponse(
                    id=str(row.id),
                    userName=row.user_name or "Đang cập nhật",
                    bookTitle=row.book_title,
                    requestDate=row.borrow_date.strftime("%d/%m/%Y"),
                    type="borrow",
                    status="pending"
                )
            )

        return pending_requests

    async def get_admin_recent_borrows(self) -> list[AdminRecentBorrowResponse]:
        now = datetime.now()
        
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
            elif row.due_date < now and row.status == BorrowStatus.BORROWING:
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
                    status=status
                )
            )

        return recent_borrows

    async def get_admin_category_stats(self) -> list[CategoryStatResponse]:
        # Tính tổng số lượng sách toàn hệ thống đã được mượn để quy ra phần trăm
        total_stmt = (
            select(func.coalesce(func.sum(BorrowItem.quantity), 0))
            .select_from(BorrowItem)
        )
        total_count = (await self.db.execute(total_stmt)).scalar() or 0
        if total_count == 0:
            total_count = 1  # Tránh lỗi chia cho 0

        # Truy vấn gom nhóm số lượng mượn theo từng danh mục trên toàn hệ thống
        stmt = (
            select(
                Category.name.label("category_name"),
                func.coalesce(func.sum(BorrowItem.quantity), 0).label("count")
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
                    percentage=percentage
                )
            )

        return stats

    def _map_category_key(self, name: str) -> str:
        mapping = {
            "Kỹ năng sống": "lifeSkills",
            "Kinh tế - Quản trị": "economics",
            "Văn học": "literature",
            "Khoa học - Công nghệ": "science",
            "Lịch sử - Tiểu sử": "history"
        }
        return mapping.get(name, name.lower().replace(" ", "-"))
    
    async def get_admin_borrow_summary(self) -> List[BorrowSummaryStatResponse]:
        # 1. Tổng số lượt mượn toàn hệ thống
        total_borrows_stmt = select(func.count(BorrowRecord.id))
        total_borrows = (await self.db.execute(total_borrows_stmt)).scalar() or 0

        # 2. Tổng số sách đã trả toàn hệ thống
        returned_books_stmt = (
            select(func.coalesce(func.sum(BorrowItem.quantity), 0))
            .select_from(BorrowItem)
            .join(BorrowRecord, BorrowItem.borrow_id == BorrowRecord.id)
            .where(BorrowItem.returned == True)
        )
        returned_books = (await self.db.execute(returned_books_stmt)).scalar() or 0

        # 3. Tính tỷ lệ trả sách đúng hạn trên toàn hệ thống
        total_returned_stmt = select(func.count(BorrowRecord.id)).where(BorrowRecord.status == BorrowStatus.RETURNED)
        total_returned = (await self.db.execute(total_returned_stmt)).scalar() or 0

        on_time_stmt = (
            select(func.count(BorrowRecord.id))
            .where(
                and_(
                    BorrowRecord.status == BorrowStatus.RETURNED,
                    BorrowRecord.return_date <= BorrowRecord.due_date
                )
            )
        )
        on_time_count = (await self.db.execute(on_time_stmt)).scalar() or 0
        rate = (on_time_count / total_returned * 100) if total_returned > 0 else 0.0

        return [
            BorrowSummaryStatResponse(
                label="Tổng số lượt mượn",
                value=str(total_borrows),
                unit="lượt"
            ),
            BorrowSummaryStatResponse(
                label="Sách đã trả",
                value=str(returned_books),
                unit="cuốn"
            ),
            BorrowSummaryStatResponse(
                label="Tỉ lệ đúng hạn",
                value=f"{rate:.1f}%",
                trend=BorrowTrend(value="5%", direction="up")
            )
        ]

    async def get_admin_borrow_overview(self, period: str) -> BorrowOverviewResponse:
        months_map = {"3m": 3, "6m": 6, "12m": 12}
        months_count = months_map.get(period, 3)
        
        now = datetime.now()
        trend_data: List[BorrowTrendPoint] = []
        
        for i in range(months_count - 1, -1, -1):
            total_months = now.year * 12 + (now.month - 1) - i
            target_year = total_months // 12
            target_month = (total_months % 12) + 1
            month_label = f"{target_month:02d}/{target_year}"
            
            stmt = select(func.count(BorrowRecord.id)).where(
                and_(
                    func.extract("month", BorrowRecord.borrow_date) == target_month,
                    func.extract("year", BorrowRecord.borrow_date) == target_year
                )
            )
            count = (await self.db.execute(stmt)).scalar() or 0
            trend_data.append(BorrowTrendPoint(month=month_label, count=float(count)))

        stats = await self.get_admin_borrow_summary()

        return BorrowOverviewResponse(
            stats=stats,
            trend=trend_data
        )

    async def approve_borrow_request(self, record_id: uuid.UUID) -> None:
        # 1. Tìm phiếu mượn sách theo ID
        result = await self.db.execute(
            select(BorrowRecord).where(BorrowRecord.id == record_id)
        )
        record = result.scalars().first()

        # 2. Kiểm tra tồn tại
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy yêu cầu mượn sách."
            )

        # 3. Kiểm tra trạng thái hiện tại (chỉ duyệt các phiếu đang chờ)
        if record.status != BorrowStatus.RETURNED:  # Giả sử trạng thái chờ duyệt là RETURNED
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Yêu cầu mượn sách không ở trạng thái chờ duyệt."
            )

        # 4. Cập nhật trạng thái thành đã duyệt
        record.status = BorrowStatus.BORROWING
        
        await self.db.commit()

async def reject_borrow_request(self, record_id: uuid.UUID) -> None:
        result = await self.db.execute(
            select(BorrowRecord).where(BorrowRecord.id == record_id)
        )
        record = result.scalars().first()

        # 1. Kiểm tra tồn tại (loại trừ None cho Pylance)
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy yêu cầu mượn sách."
            )

        # 2. Kiểm tra trạng thái hiện tại
        if record.status != BorrowStatus.RETURNED:  # Giả sử trạng thái chờ duyệt là RETURNED
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Yêu cầu mượn sách không ở trạng thái chờ duyệt."
            )

        # 3. Cập nhật trạng thái thành từ chối
        record.status = BorrowStatus.RETURNED # Giả sử trạng thái từ chối là RETURNED (Đề xuất thêm trạng thái REJECTED)
        await self.db.commit()