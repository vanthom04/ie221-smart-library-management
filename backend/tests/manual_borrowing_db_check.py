"""Run the borrowing checklist against the configured database, then roll it back.

Usage: uv run python -m tests.manual_borrowing_db_check
"""

import asyncio
import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import InvalidOperationError
from app.db.session import engine
from app.models.book import Book
from app.models.borrow_record import BorrowStatus
from app.models.category import Category
from app.models.reservation import ReservationStatus
from app.models.user import User, UserRole, UserStatus
from app.repositories.borrowing_repository import BorrowingRepository
from app.schemas.borrowing import BookQuantityInput, ReservationCreate
from app.services.borrowing_service import BorrowingService


async def main() -> None:
    marker = uuid.uuid4().hex[:12]
    async with engine.connect() as connection:
        outer = await connection.begin()
        try:
            async with AsyncSession(
                bind=connection, join_transaction_mode="create_savepoint", expire_on_commit=False
            ) as session:
                category = Category(name=f"Borrowing DB check {marker}")
                user = User(
                    full_name="Borrowing DB check user",
                    email=f"borrow-{marker}@example.invalid",
                    hashed_password="test-only-no-login",
                    role=UserRole.USER,
                    status=UserStatus.ACTIVE,
                )
                waiting_user = User(
                    full_name="Borrowing DB check waiting user",
                    email=f"wait-{marker}@example.invalid",
                    hashed_password="test-only-no-login",
                    role=UserRole.USER,
                    status=UserStatus.ACTIVE,
                )
                admin = User(
                    full_name="Borrowing DB check admin",
                    email=f"admin-{marker}@example.invalid",
                    hashed_password="test-only-no-login",
                    role=UserRole.ADMIN,
                    status=UserStatus.ACTIVE,
                )
                session.add_all([category, user, waiting_user, admin])
                await session.flush()
                book = Book(
                    title=f"Borrowing DB check {marker}",
                    isbn=f"TB-{marker}",
                    category_id=category.id,
                    quantity=5,
                    available_quantity=5,
                )
                session.add(book)
                await session.commit()

                service = BorrowingService(BorrowingRepository(session))
                payload = ReservationCreate(items=[BookQuantityInput(book_id=book.id, quantity=1)])

                async def inventory(expected: int, step: str) -> None:
                    await session.refresh(book)
                    assert (book.quantity, book.available_quantity) == (5, expected), step
                    print(f"{step}: {book.available_quantity}/5")

                await inventory(5, "initial")
                reservation = await service.create_reservation(user, payload)
                assert reservation.status == ReservationStatus.PENDING
                await inventory(5, "reservation pending")

                reservation = await service.approve_reservation(reservation.id, admin)
                assert reservation.status == ReservationStatus.APPROVED
                await inventory(4, "reservation approved")

                borrow = await service.borrow_from_reservation(reservation.id)
                assert borrow.status == BorrowStatus.BORROWING
                assert reservation.status == ReservationStatus.FULFILLED
                await inventory(4, "borrow from reservation")

                old_due_date = borrow.due_date
                borrow = await service.renew_borrow(borrow.id, user)
                assert borrow.due_date > old_due_date
                assert borrow.renewal_count == 1
                await inventory(4, "renew")

                borrow = await service.return_borrow(borrow.id)
                assert borrow.status == BorrowStatus.RETURNED
                await inventory(5, "return")

                cancelled = await service.create_reservation(user, payload)
                await service.approve_reservation(cancelled.id, admin)
                await inventory(4, "approve before cancel")
                cancelled = await service.cancel_reservation(cancelled.id, user)
                assert cancelled.status == ReservationStatus.CANCELLED
                await inventory(5, "cancel approved reservation")

                expired = await service.create_reservation(user, payload)
                await service.approve_reservation(expired.id, admin)
                await inventory(4, "approve before expiry")
                expired.expires_at = datetime.now(UTC) - timedelta(minutes=1)
                await session.commit()
                count = await service.expire_reservations()
                assert count >= 1
                await session.refresh(expired)
                assert expired.status == ReservationStatus.EXPIRED
                await inventory(5, "expire approved reservation")

                held = await service.create_reservation(user, payload)
                await service.approve_reservation(held.id, admin)
                active_borrow = await service.borrow_from_reservation(held.id)
                waiting = await service.create_reservation(waiting_user, payload)
                assert waiting.status == ReservationStatus.PENDING
                original_due = active_borrow.due_date
                try:
                    await service.renew_borrow(active_borrow.id, user)
                except InvalidOperationError:
                    pass
                else:
                    raise AssertionError("renew with another user waiting should be blocked")
                await session.refresh(active_borrow)
                assert active_borrow.due_date == original_due
                assert active_borrow.renewal_count == 0
                await inventory(4, "renew blocked by waiting reservation")
                print("PASS: all borrowing DB checks")
        finally:
            await outer.rollback()
            await engine.dispose()
            print("Rolled back temporary DB records")


if __name__ == "__main__":
    asyncio.run(main())
