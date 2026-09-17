import uuid
from collections.abc import AsyncIterator, Sequence
from contextlib import asynccontextmanager
from datetime import datetime

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.book import Book
from app.models.borrow_item import BorrowItem
from app.models.borrow_record import BorrowRecord
from app.models.reservation import Reservation, ReservationStatus
from app.models.reservation_item import ReservationItem
from app.models.user import User


class BorrowingRepository:
    """Data access cho toàn bộ luồng đặt trước và mượn/trả.

    Các phương thức ghi chỉ ``flush``. Service quyết định ranh giới transaction
    để thay đổi phiếu và tồn kho luôn commit hoặc rollback cùng nhau.
    """

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    @asynccontextmanager
    async def transaction(self) -> AsyncIterator[None]:
        try:
            yield
            await self._session.commit()
        except Exception:
            await self._session.rollback()
            raise

    async def get_user(self, user_id: uuid.UUID) -> User | None:
        return await self._session.get(User, user_id)

    async def lock_books(self, book_ids: Sequence[uuid.UUID]) -> dict[uuid.UUID, Book]:
        # Stable ordering reduces deadlock risk when two requests contain the same books.
        statement = select(Book).where(Book.id.in_(book_ids)).order_by(Book.id).with_for_update()
        result = await self._session.execute(statement)
        return {book.id: book for book in result.scalars().all()}

    async def create_reservation(self, user_id: uuid.UUID, items: Sequence[tuple[uuid.UUID, int]]) -> Reservation:
        reservation = Reservation(user_id=user_id, status=ReservationStatus.PENDING)
        reservation.items = [ReservationItem(book_id=book_id, quantity=quantity) for book_id, quantity in items]
        self._session.add(reservation)
        await self._session.flush()
        return reservation

    async def get_reservation(self, reservation_id: uuid.UUID, *, for_update: bool = False) -> Reservation | None:
        statement = (
            select(Reservation)
            .where(Reservation.id == reservation_id)
            .options(selectinload(Reservation.items).selectinload(ReservationItem.book))
        )
        if for_update:
            statement = statement.with_for_update()
        result = await self._session.execute(statement)
        return result.scalar_one_or_none()

    async def list_reservations_for_user(self, user_id: uuid.UUID) -> list[Reservation]:
        statement = (
            select(Reservation)
            .where(Reservation.user_id == user_id)
            .options(selectinload(Reservation.items).selectinload(ReservationItem.book))
            .order_by(Reservation.created_at.desc())
        )
        result = await self._session.execute(statement)
        return list(result.scalars().all())

    async def list_reservations(self, status: ReservationStatus | None = None) -> list[Reservation]:
        statement = select(Reservation).options(selectinload(Reservation.items).selectinload(ReservationItem.book))
        if status is not None:
            statement = statement.where(Reservation.status == status)
        result = await self._session.execute(statement.order_by(Reservation.created_at.desc()))
        return list(result.scalars().all())

    async def list_expired_approved(self, now: datetime) -> list[Reservation]:
        statement = (
            select(Reservation)
            .where(
                Reservation.status == ReservationStatus.APPROVED,
                Reservation.expires_at.is_not(None),
                Reservation.expires_at <= now,
            )
            .options(selectinload(Reservation.items))
            .order_by(Reservation.id)
            .with_for_update()
        )
        result = await self._session.execute(statement)
        return list(result.scalars().all())

    async def create_borrow_record(
        self,
        *,
        user_id: uuid.UUID,
        reservation_id: uuid.UUID | None,
        borrow_date: datetime,
        due_date: datetime,
        items: Sequence[tuple[uuid.UUID, int]],
    ) -> BorrowRecord:
        borrow = BorrowRecord(
            user_id=user_id,
            reservation_id=reservation_id,
            borrow_date=borrow_date,
            due_date=due_date,
        )
        borrow.items = [BorrowItem(book_id=book_id, quantity=quantity) for book_id, quantity in items]
        self._session.add(borrow)
        await self._session.flush()
        return borrow

    async def get_borrow_record(self, borrow_id: uuid.UUID, *, for_update: bool = False) -> BorrowRecord | None:
        statement = (
            select(BorrowRecord)
            .where(BorrowRecord.id == borrow_id)
            .options(selectinload(BorrowRecord.items).selectinload(BorrowItem.book))
        )
        if for_update:
            statement = statement.with_for_update()
        result = await self._session.execute(statement)
        return result.scalar_one_or_none()

    async def list_borrow_records_for_user(self, user_id: uuid.UUID) -> list[BorrowRecord]:
        statement = (
            select(BorrowRecord)
            .where(BorrowRecord.user_id == user_id)
            .options(selectinload(BorrowRecord.items).selectinload(BorrowItem.book))
            .order_by(BorrowRecord.created_at.desc())
        )
        result = await self._session.execute(statement)
        return list(result.scalars().all())

    async def list_borrow_records(self) -> list[BorrowRecord]:
        statement = (
            select(BorrowRecord)
            .options(selectinload(BorrowRecord.items).selectinload(BorrowItem.book))
            .order_by(BorrowRecord.created_at.desc())
        )
        result = await self._session.execute(statement)
        return list(result.scalars().all())

    async def has_waiting_reservation(
        self,
        book_ids: Sequence[uuid.UUID],
        *,
        excluding_user_id: uuid.UUID,
        now: datetime,
    ) -> bool:
        statement = (
            select(ReservationItem.id)
            .join(Reservation, Reservation.id == ReservationItem.reservation_id)
            .where(
                ReservationItem.book_id.in_(book_ids),
                Reservation.user_id != excluding_user_id,
                Reservation.status.in_([ReservationStatus.PENDING, ReservationStatus.APPROVED]),
                or_(Reservation.expires_at.is_(None), Reservation.expires_at > now),
            )
            .limit(1)
        )
        result = await self._session.execute(statement)
        return result.scalar_one_or_none() is not None

    async def refresh_reservation(self, reservation: Reservation) -> Reservation:
        await self._session.flush()
        return await self.get_reservation(reservation.id) or reservation

    async def refresh_borrow_record(self, borrow: BorrowRecord) -> BorrowRecord:
        await self._session.flush()
        return await self.get_borrow_record(borrow.id) or borrow
