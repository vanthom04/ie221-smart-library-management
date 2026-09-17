from datetime import datetime
import uuid
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.borrow_item import BorrowItem
from app.models.book import Book
from app.models.book_author import BookAuthor
from app.models.author import Author
from app.models.borrow_record import BorrowRecord, BorrowStatus
from app.models.fine import Fine, PaymentStatus
from app.models.reservation import Reservation, ReservationStatus
from app.schemas.dashboard import ActivityItemResponse, DashboardQuickStatResponse, BorrowedBookResponse, DueSoonBookResponse


class DashboardService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_user_quick_stats(self, user_id: uuid.UUID) -> list[DashboardQuickStatResponse]:
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
    