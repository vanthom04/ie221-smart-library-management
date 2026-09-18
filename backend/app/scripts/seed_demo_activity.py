# ruff: noqa: E501
"""Seed lịch sử mượn/đặt trước cho Dashboard và AI Recommendation.

Chạy:
    uv run python -m app.scripts.seed_demo_activity
"""

from __future__ import annotations

import asyncio
from datetime import UTC, datetime, timedelta

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import AsyncSessionLocal
from app.models.book import Book
from app.models.borrow_item import BorrowItem
from app.models.borrow_record import BorrowRecord, BorrowStatus
from app.models.reservation import Reservation, ReservationStatus
from app.models.reservation_item import ReservationItem
from app.models.user import User
from app.scripts.demo_seed_data import DEMO_USERS, ensure_demo_seed_allowed

ADMIN_EMAIL = "demo.admin@example.com"
USER_1_EMAIL = "demo.minhanh@example.com"
USER_2_EMAIL = "demo.giahuy@example.com"

ISBN = {
    "dac_nhan_tam": "9786049000001",
    "seven_habits": "9786049000002",
    "atomic_habits": "9786049000003",
    "deep_work": "9786049000004",
    "lean_startup": "9786049000006",
    "thinking_fast_slow": "9786049000007",
    "alchemist": "9786049000009",
    "clean_code": "9786049000014",
    "pragmatic": "9786049000015",
    "sapiens": "9786049000017",
    "steve_jobs": "9786049000019",
}


async def load_demo_users(session: AsyncSession) -> dict[str, User]:
    emails = [item["email"] for item in DEMO_USERS]
    users = (await session.execute(select(User).where(User.email.in_(emails)))).scalars().all()
    by_email = {user.email: user for user in users}
    missing = [email for email in emails if email not in by_email]
    if missing:
        raise RuntimeError("Thiếu user demo. Chạy seed_demo_base trước: " + ", ".join(missing))
    return by_email


async def load_demo_books(session: AsyncSession) -> dict[str, Book]:
    isbns = list(ISBN.values())
    books = (await session.execute(select(Book).where(Book.isbn.in_(isbns)))).scalars().all()
    by_isbn = {book.isbn: book for book in books}
    missing = [isbn for isbn in isbns if isbn not in by_isbn]
    if missing:
        raise RuntimeError("Thiếu sách demo. Chạy seed_demo_base trước: " + ", ".join(missing))
    return by_isbn


async def reset_demo_transactions(session: AsyncSession, users: dict[str, User]) -> None:
    user_ids = [user.id for user in users.values()]
    await session.execute(delete(BorrowRecord).where(BorrowRecord.user_id.in_(user_ids)))
    await session.execute(delete(Reservation).where(Reservation.user_id.in_(user_ids)))
    await session.flush()


def make_borrow(
    *,
    user: User,
    book: Book,
    borrow_date: datetime,
    due_date: datetime,
    return_date: datetime | None,
    status: BorrowStatus,
    returned: bool,
) -> BorrowRecord:
    record = BorrowRecord(
        user_id=user.id,
        reservation_id=None,
        borrow_date=borrow_date,
        due_date=due_date,
        return_date=return_date,
        renewal_count=0,
        renewed_at=None,
        status=status,
    )
    record.created_at = borrow_date
    record.items = [BorrowItem(book_id=book.id, quantity=1, returned=returned)]
    return record


async def recalculate_demo_book_availability(session: AsyncSession, books: dict[str, Book]) -> None:
    book_ids = [book.id for book in books.values()]

    active_rows = (
        await session.execute(
            select(
                BorrowItem.book_id,
                func.coalesce(func.sum(BorrowItem.quantity), 0).label("used"),
            )
            .join(BorrowRecord, BorrowRecord.id == BorrowItem.borrow_id)
            .where(
                BorrowItem.book_id.in_(book_ids),
                BorrowItem.returned.is_(False),
                BorrowRecord.status.in_([BorrowStatus.BORROWING, BorrowStatus.OVERDUE]),
            )
            .group_by(BorrowItem.book_id)
        )
    ).all()

    reserved_rows = (
        await session.execute(
            select(
                ReservationItem.book_id,
                func.coalesce(func.sum(ReservationItem.quantity), 0).label("reserved"),
            )
            .join(Reservation, Reservation.id == ReservationItem.reservation_id)
            .where(
                ReservationItem.book_id.in_(book_ids),
                Reservation.status == ReservationStatus.APPROVED,
            )
            .group_by(ReservationItem.book_id)
        )
    ).all()

    borrowed = {row.book_id: int(row.used) for row in active_rows}
    reserved = {row.book_id: int(row.reserved) for row in reserved_rows}

    for book in books.values():
        unavailable = borrowed.get(book.id, 0) + reserved.get(book.id, 0)
        book.available_quantity = max(0, book.quantity - unavailable)


async def seed_demo_activity() -> None:
    ensure_demo_seed_allowed()
    now = datetime.now(UTC)

    async with AsyncSessionLocal() as session:
        try:
            users = await load_demo_users(session)
            books = await load_demo_books(session)
            await reset_demo_transactions(session, users)

            admin = users[ADMIN_EMAIL]
            user_1 = users[USER_1_EMAIL]
            user_2 = users[USER_2_EMAIL]

            session.add_all(
                [
                    make_borrow(
                        user=user_1,
                        book=books[ISBN["dac_nhan_tam"]],
                        borrow_date=now - timedelta(days=82),
                        due_date=now - timedelta(days=68),
                        return_date=now - timedelta(days=72),
                        status=BorrowStatus.RETURNED,
                        returned=True,
                    ),
                    make_borrow(
                        user=user_1,
                        book=books[ISBN["seven_habits"]],
                        borrow_date=now - timedelta(days=51),
                        due_date=now - timedelta(days=37),
                        return_date=now - timedelta(days=40),
                        status=BorrowStatus.RETURNED,
                        returned=True,
                    ),
                    make_borrow(
                        user=user_1,
                        book=books[ISBN["lean_startup"]],
                        borrow_date=now - timedelta(days=24),
                        due_date=now - timedelta(days=10),
                        return_date=now - timedelta(days=13),
                        status=BorrowStatus.RETURNED,
                        returned=True,
                    ),
                    make_borrow(
                        user=user_1,
                        book=books[ISBN["atomic_habits"]],
                        borrow_date=now - timedelta(days=8),
                        due_date=now + timedelta(days=6),
                        return_date=None,
                        status=BorrowStatus.BORROWING,
                        returned=False,
                    ),
                    # Giữ BORROWING nhưng due_date đã qua để Dashboard hiện quá hạn theo logic hiện tại.
                    make_borrow(
                        user=user_1,
                        book=books[ISBN["thinking_fast_slow"]],
                        borrow_date=now - timedelta(days=18),
                        due_date=now - timedelta(days=4),
                        return_date=None,
                        status=BorrowStatus.BORROWING,
                        returned=False,
                    ),
                    make_borrow(
                        user=user_2,
                        book=books[ISBN["alchemist"]],
                        borrow_date=now - timedelta(days=65),
                        due_date=now - timedelta(days=51),
                        return_date=now - timedelta(days=55),
                        status=BorrowStatus.RETURNED,
                        returned=True,
                    ),
                    make_borrow(
                        user=user_2,
                        book=books[ISBN["clean_code"]],
                        borrow_date=now - timedelta(days=34),
                        due_date=now - timedelta(days=20),
                        return_date=now - timedelta(days=23),
                        status=BorrowStatus.RETURNED,
                        returned=True,
                    ),
                    make_borrow(
                        user=user_2,
                        book=books[ISBN["sapiens"]],
                        borrow_date=now - timedelta(days=16),
                        due_date=now - timedelta(days=2),
                        return_date=now - timedelta(days=4),
                        status=BorrowStatus.RETURNED,
                        returned=True,
                    ),
                    make_borrow(
                        user=user_2,
                        book=books[ISBN["pragmatic"]],
                        borrow_date=now - timedelta(days=5),
                        due_date=now + timedelta(days=9),
                        return_date=None,
                        status=BorrowStatus.BORROWING,
                        returned=False,
                    ),
                ]
            )

            pending = Reservation(user_id=user_2.id, status=ReservationStatus.PENDING)
            pending.created_at = now - timedelta(days=1)
            pending.items = [ReservationItem(book_id=books[ISBN["deep_work"]].id, quantity=1)]
            session.add(pending)

            rejected = Reservation(
                user_id=user_1.id,
                status=ReservationStatus.REJECTED,
                reviewed_at=now - timedelta(days=3),
                reviewed_by=admin.id,
                rejection_reason="Bản demo: yêu cầu không được duyệt.",
            )
            rejected.created_at = now - timedelta(days=4)
            rejected.items = [ReservationItem(book_id=books[ISBN["steve_jobs"]].id, quantity=1)]
            session.add(rejected)

            await session.flush()
            await recalculate_demo_book_availability(session, books)
            await session.commit()

            print("Seed transaction demo hoàn tất")
            print("- 9 borrow records")
            print("- 3 active/overdue-by-date records")
            print("- 2 reservations (pending + rejected)")
            print("- Inventory đã được tính lại")
        except Exception:
            await session.rollback()
            raise


async def main() -> None:
    await seed_demo_activity()


if __name__ == "__main__":
    asyncio.run(main())
