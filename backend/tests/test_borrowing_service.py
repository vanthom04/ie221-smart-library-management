import uuid
from contextlib import asynccontextmanager
from datetime import UTC, datetime, timedelta
from unittest import IsolatedAsyncioTestCase
from unittest.mock import AsyncMock

from app.core.exceptions import InvalidOperationError
from app.models.book import Book
from app.models.borrow_item import BorrowItem
from app.models.borrow_record import BorrowRecord, BorrowStatus
from app.models.reservation import Reservation, ReservationStatus
from app.models.reservation_item import ReservationItem
from app.models.user import User, UserRole, UserStatus
from app.repositories.borrowing_repository import BorrowingRepository
from app.services.borrowing_service import BorrowingService


def make_user(role: UserRole = UserRole.USER) -> User:
    user = User(
        full_name="Test User",
        email=f"{uuid.uuid4()}@example.com",
        hashed_password="hash",
        role=role,
        status=UserStatus.ACTIVE,
    )
    user.id = uuid.uuid4()
    return user


def make_book(available: int = 3) -> Book:
    book = Book(
        title="Clean Code",
        isbn=str(uuid.uuid4()),
        category_id=uuid.uuid4(),
        quantity=available,
        available_quantity=available,
    )
    book.id = uuid.uuid4()
    return book


def make_reservation(user: User, book: Book, status: ReservationStatus) -> Reservation:
    item = ReservationItem(book_id=book.id, quantity=1)
    item.id = uuid.uuid4()
    item.book = book
    reservation = Reservation(user_id=user.id, status=status)
    reservation.id = uuid.uuid4()
    reservation.created_at = datetime.now(UTC)
    reservation.items = [item]
    if status == ReservationStatus.APPROVED:
        reservation.expires_at = datetime.now(UTC) + timedelta(days=3)
    return reservation


def make_borrow(user: User, book: Book) -> BorrowRecord:
    item = BorrowItem(book_id=book.id, quantity=1, returned=False)
    item.id = uuid.uuid4()
    item.book = book
    now = datetime.now(UTC)
    borrow = BorrowRecord(
        user_id=user.id,
        borrow_date=now,
        due_date=now + timedelta(days=14),
        status=BorrowStatus.BORROWING,
        renewal_count=0,
    )
    borrow.id = uuid.uuid4()
    borrow.created_at = now
    borrow.items = [item]
    return borrow


class FakeBorrowingRepository:
    def __init__(self, *, books=None, reservations=None, borrows=None, waiting=False):
        self.books = {book.id: book for book in (books or [])}
        self.reservations = {item.id: item for item in (reservations or [])}
        self.borrows = {item.id: item for item in (borrows or [])}
        self.waiting = waiting

    @asynccontextmanager
    async def transaction(self):
        yield

    async def list_expired_approved(self, now):
        return [
            reservation
            for reservation in self.reservations.values()
            if reservation.status == ReservationStatus.APPROVED
            and reservation.expires_at is not None
            and reservation.expires_at <= now
        ]

    async def lock_books(self, book_ids):
        return {book_id: self.books[book_id] for book_id in book_ids if book_id in self.books}

    async def get_reservation(self, reservation_id, *, for_update=False):
        return self.reservations.get(reservation_id)

    async def refresh_reservation(self, reservation):
        return reservation

    async def create_borrow_record(self, *, user_id, reservation_id, borrow_date, due_date, items):
        borrow_items = []
        for book_id, quantity in items:
            item = BorrowItem(book_id=book_id, quantity=quantity, returned=False)
            item.id = uuid.uuid4()
            item.book = self.books[book_id]
            borrow_items.append(item)
        borrow = BorrowRecord(
            user_id=user_id,
            reservation_id=reservation_id,
            borrow_date=borrow_date,
            due_date=due_date,
            status=BorrowStatus.BORROWING,
            renewal_count=0,
        )
        borrow.id = uuid.uuid4()
        borrow.created_at = borrow_date
        borrow.items = borrow_items
        self.borrows[borrow.id] = borrow
        return borrow

    async def refresh_borrow_record(self, borrow):
        return borrow

    async def get_borrow_record(self, borrow_id, *, for_update=False):
        return self.borrows.get(borrow_id)

    async def has_waiting_reservation(self, _book_ids, *, excluding_user_id, now):
        return self.waiting


class BorrowingRepositoryTransactionTests(IsolatedAsyncioTestCase):
    async def test_transaction_commits_on_success(self):
        session = AsyncMock()
        repository = BorrowingRepository(session)

        async with repository.transaction():
            pass

        session.commit.assert_awaited_once()
        session.rollback.assert_not_awaited()

    async def test_transaction_rolls_back_on_failure(self):
        session = AsyncMock()
        repository = BorrowingRepository(session)

        with self.assertRaisesRegex(RuntimeError, "boom"):
            async with repository.transaction():
                raise RuntimeError("boom")

        session.rollback.assert_awaited_once()
        session.commit.assert_not_awaited()


class BorrowingServiceTests(IsolatedAsyncioTestCase):
    async def test_approve_holds_inventory_atomically(self):
        user = make_user()
        admin = make_user(UserRole.ADMIN)
        book = make_book(available=2)
        reservation = make_reservation(user, book, ReservationStatus.PENDING)
        repository = FakeBorrowingRepository(books=[book], reservations=[reservation])

        result = await BorrowingService(repository).approve_reservation(reservation.id, admin)

        self.assertEqual(result.status, ReservationStatus.APPROVED)
        self.assertEqual(book.available_quantity, 1)
        self.assertEqual(result.reviewed_by, admin.id)
        self.assertIsNotNone(result.expires_at)

    async def test_borrow_from_reservation_does_not_decrement_inventory_twice(self):
        user = make_user()
        book = make_book(available=1)
        reservation = make_reservation(user, book, ReservationStatus.APPROVED)
        repository = FakeBorrowingRepository(books=[book], reservations=[reservation])

        borrow = await BorrowingService(repository).borrow_from_reservation(reservation.id)

        self.assertEqual(book.available_quantity, 1)
        self.assertEqual(reservation.status, ReservationStatus.FULFILLED)
        self.assertEqual(borrow.reservation_id, reservation.id)

    async def test_return_restores_inventory(self):
        user = make_user()
        book = make_book(available=0)
        book.quantity = 1
        borrow = make_borrow(user, book)
        repository = FakeBorrowingRepository(books=[book], borrows=[borrow])

        result = await BorrowingService(repository).return_borrow(borrow.id)

        self.assertEqual(result.status, BorrowStatus.RETURNED)
        self.assertEqual(book.available_quantity, 1)
        self.assertTrue(result.items[0].returned)

    async def test_renewal_is_blocked_when_another_reader_is_waiting(self):
        user = make_user()
        book = make_book()
        borrow = make_borrow(user, book)
        repository = FakeBorrowingRepository(books=[book], borrows=[borrow], waiting=True)

        with self.assertRaises(InvalidOperationError):
            await BorrowingService(repository).renew_borrow(borrow.id, user)

        self.assertEqual(borrow.renewal_count, 0)

    async def test_cancel_approved_reservation_releases_inventory(self):
        user = make_user()
        book = make_book(available=0)
        book.quantity = 1
        reservation = make_reservation(user, book, ReservationStatus.APPROVED)
        repository = FakeBorrowingRepository(books=[book], reservations=[reservation])

        result = await BorrowingService(repository).cancel_reservation(reservation.id, user)

        self.assertEqual(result.status, ReservationStatus.CANCELLED)
        self.assertEqual(book.available_quantity, 1)

    async def test_expired_reservation_restores_inventory(self):
        user = make_user()

        book = make_book(available=0)
        book.quantity = 1

        reservation = make_reservation(user, book, ReservationStatus.APPROVED)
        reservation.expires_at = datetime.now(UTC) - timedelta(minutes=1)

        repository = FakeBorrowingRepository(books=[book], reservations=[reservation])
        service = BorrowingService(repository)
        count = await service.expire_reservations()

        self.assertEqual(count, 1)
        self.assertEqual(reservation.status, ReservationStatus.EXPIRED)
        self.assertEqual(book.available_quantity, 1)
