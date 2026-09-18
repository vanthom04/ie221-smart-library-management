import uuid
from datetime import UTC, datetime, timedelta

from app.core.config import settings
from app.core.exceptions import (
    InsufficientBookAvailabilityError,
    InsufficientPermissionError,
    InvalidOperationError,
    ResourceNotFoundError,
)
from app.models.book import Book
from app.models.borrow_record import BorrowRecord, BorrowStatus
from app.models.reservation import Reservation, ReservationStatus
from app.models.user import User, UserRole, UserStatus
from app.repositories.borrowing_repository import BorrowingRepository
from app.schemas.borrowing import BookQuantityInput, BorrowCreate, ReservationCreate


class BorrowingService:
    """Nghiệp vụ đặt trước, duyệt, mượn, trả và gia hạn sách."""

    def __init__(self, repository: BorrowingRepository) -> None:
        self._repository = repository

    async def create_reservation(self, user: User, payload: ReservationCreate) -> Reservation:
        async with self._repository.transaction():
            books = await self._lock_and_validate_books(payload.items)
            self._ensure_available(books, payload.items)
            reservation = await self._repository.create_reservation(
                user.id, [(item.book_id, item.quantity) for item in payload.items]
            )
            return await self._repository.refresh_reservation(reservation)

    async def list_my_reservations(self, user: User) -> list[Reservation]:
        return await self._repository.list_reservations_for_user(user.id)

    async def list_reservations(self, status: ReservationStatus | None = None) -> list[Reservation]:
        return await self._repository.list_reservations(status)

    async def approve_reservation(self, reservation_id: uuid.UUID, admin: User) -> Reservation:
        now = datetime.now(UTC)

        await self.expire_reservations()

        async with self._repository.transaction():
            reservation = await self._get_reservation(reservation_id, for_update=True)
            self._require_reservation_status(reservation, ReservationStatus.PENDING)

            books = await self._repository.lock_books([item.book_id for item in reservation.items])
            self._ensure_available(books, reservation.items)

            for item in reservation.items:
                books[item.book_id].available_quantity -= item.quantity

            reservation.status = ReservationStatus.APPROVED
            reservation.expires_at = now + timedelta(days=settings.RESERVATION_HOLD_DAYS)

            return await self._repository.refresh_reservation(reservation)

    async def cancel_reservation(self, reservation_id: uuid.UUID, actor: User) -> Reservation:
        async with self._repository.transaction():
            reservation = await self._get_reservation(reservation_id, for_update=True)
            if actor.role != UserRole.ADMIN and reservation.user_id != actor.id:
                raise InsufficientPermissionError("Bạn không có quyền hủy phiếu đặt trước này!")
            if reservation.status not in {
                ReservationStatus.PENDING,
                ReservationStatus.APPROVED,
            }:
                raise InvalidOperationError("Chỉ có thể hủy phiếu đang chờ hoặc đã được duyệt!")
            if reservation.status == ReservationStatus.APPROVED:
                await self._restore_reserved_inventory(reservation)
            reservation.status = ReservationStatus.CANCELLED
            return await self._repository.refresh_reservation(reservation)

    async def expire_reservations(self) -> int:
        async with self._repository.transaction():
            return await self._release_expired_reservations(datetime.now(UTC))

    async def create_direct_borrow(self, payload: BorrowCreate) -> BorrowRecord:
        now = datetime.now(UTC)

        await self.expire_reservations()

        async with self._repository.transaction():
            await self._release_expired_reservations(now)
            borrower = await self._repository.get_user(payload.user_id)
            if borrower is None:
                raise ResourceNotFoundError("Không tìm thấy người mượn!")
            if borrower.status != UserStatus.ACTIVE:
                raise InvalidOperationError("Tài khoản người mượn đang bị khóa!")
            books = await self._lock_and_validate_books(payload.items)
            self._ensure_available(books, payload.items)
            for item in payload.items:
                books[item.book_id].available_quantity -= item.quantity
            borrow = await self._repository.create_borrow_record(
                user_id=payload.user_id,
                reservation_id=None,
                borrow_date=now,
                due_date=now + timedelta(days=settings.BORROW_DAYS),
                items=[(item.book_id, item.quantity) for item in payload.items],
            )
            return await self._repository.refresh_borrow_record(borrow)

    async def borrow_from_reservation(self, reservation_id: uuid.UUID) -> BorrowRecord:
        now = datetime.now(UTC)

        await self.expire_reservations()

        async with self._repository.transaction():
            reservation = await self._get_reservation(reservation_id, for_update=True)
            self._require_reservation_status(reservation, ReservationStatus.APPROVED)

            borrow = await self._repository.create_borrow_record(
                user_id=reservation.user_id,
                reservation_id=reservation.id,
                borrow_date=now,
                due_date=now + timedelta(days=settings.BORROW_DAYS),
                items=[(item.book_id, item.quantity) for item in reservation.items],
            )

            # The existing schema has no fulfilled status/fulfilled_at column.
            # CANCELLED closes the reservation after it has been converted to a borrow record.
            reservation.status = ReservationStatus.CANCELLED

            return await self._repository.refresh_borrow_record(borrow)

    async def list_my_borrow_records(self, user: User) -> list[BorrowRecord]:
        return await self._repository.list_borrow_records_for_user(user.id)

    async def list_borrow_records(self) -> list[BorrowRecord]:
        return await self._repository.list_borrow_records()

    async def return_borrow(self, borrow_id: uuid.UUID) -> BorrowRecord:
        now = datetime.now(UTC)
        async with self._repository.transaction():
            borrow = await self._get_borrow_record(borrow_id, for_update=True)
            if borrow.status not in {BorrowStatus.BORROWING, BorrowStatus.OVERDUE}:
                raise InvalidOperationError("Phiếu mượn này đã được trả!")
            books = await self._repository.lock_books([item.book_id for item in borrow.items])
            for item in borrow.items:
                if not item.returned:
                    book = books.get(item.book_id)
                    if book is None:
                        raise ResourceNotFoundError("Không tìm thấy sách trong phiếu mượn!")
                    book.available_quantity += item.quantity
                    item.returned = True
            borrow.return_date = now
            borrow.status = BorrowStatus.RETURNED
            return await self._repository.refresh_borrow_record(borrow)

    async def renew_borrow(self, borrow_id: uuid.UUID, user: User) -> BorrowRecord:
        now = datetime.now(UTC)
        async with self._repository.transaction():
            borrow = await self._get_borrow_record(borrow_id, for_update=True)
            if borrow.user_id != user.id:
                raise InsufficientPermissionError("Bạn không có quyền gia hạn phiếu mượn này!")
            if borrow.status != BorrowStatus.BORROWING or borrow.due_date <= now:
                raise InvalidOperationError("Chỉ có thể gia hạn phiếu đang mượn và chưa quá hạn!")

            has_waiting = await self._repository.has_waiting_reservation(
                [item.book_id for item in borrow.items],
                excluding_user_id=user.id,
                now=now,
            )
            if has_waiting:
                raise InvalidOperationError("Không thể gia hạn vì sách đang có độc giả khác chờ đặt!")

            borrow.due_date += timedelta(days=settings.RENEWAL_DAYS)
            return await self._repository.refresh_borrow_record(borrow)

    async def _get_reservation(
        self, reservation_id: uuid.UUID, *, for_update: bool = False
    ) -> Reservation:
        reservation = await self._repository.get_reservation(reservation_id, for_update=for_update)
        if reservation is None:
            raise ResourceNotFoundError("Không tìm thấy phiếu đặt trước!")
        return reservation

    async def _get_borrow_record(
        self, borrow_id: uuid.UUID, *, for_update: bool = False
    ) -> BorrowRecord:
        borrow = await self._repository.get_borrow_record(borrow_id, for_update=for_update)
        if borrow is None:
            raise ResourceNotFoundError("Không tìm thấy phiếu mượn!")
        return borrow

    async def _lock_and_validate_books(
        self, items: list[BookQuantityInput]
    ) -> dict[uuid.UUID, Book]:
        books = await self._repository.lock_books([item.book_id for item in items])
        missing = [item.book_id for item in items if item.book_id not in books]
        if missing:
            raise ResourceNotFoundError(f"Không tìm thấy sách: {', '.join(map(str, missing))}")
        return books

    @staticmethod
    def _ensure_available(books: dict[uuid.UUID, Book], items) -> None:
        unavailable = [
            item for item in items if books[item.book_id].available_quantity < item.quantity
        ]
        if unavailable:
            titles = ", ".join(books[item.book_id].title for item in unavailable)
            raise InsufficientBookAvailabilityError(f"Không đủ sách sẵn có: {titles}!")

    @staticmethod
    def _require_reservation_status(reservation: Reservation, expected: ReservationStatus) -> None:
        if reservation.status != expected:
            raise InvalidOperationError(
                f"Phiếu đặt trước phải ở trạng thái '{expected.value}' để thực hiện thao tác!"
            )

    async def _restore_reserved_inventory(self, reservation: Reservation) -> None:
        books = await self._repository.lock_books([item.book_id for item in reservation.items])
        for item in reservation.items:
            book = books.get(item.book_id)
            if book is None:
                raise ResourceNotFoundError("Không tìm thấy sách trong phiếu đặt trước!")
            book.available_quantity += item.quantity

    async def _release_expired_reservations(self, now: datetime) -> int:
        reservations = await self._repository.list_expired_approved(now)
        for reservation in reservations:
            await self._restore_reserved_inventory(reservation)
            reservation.status = ReservationStatus.EXPIRED
        return len(reservations)
