import uuid

from fastapi import APIRouter, status

from app.api.deps import CurrentUser, RequireAdmin
from app.api.v1.borrowing.deps import BorrowingSvc
from app.models.reservation import ReservationStatus
from app.schemas.borrowing import (
    BorrowCreate,
    BorrowRecordRead,
    ReservationCreate,
    ReservationRead,
    TransactionResult,
)

router = APIRouter(tags=["Borrowing Core"])


@router.post("/reservations", response_model=ReservationRead, status_code=status.HTTP_201_CREATED)
async def create_reservation(
    payload: ReservationCreate, current_user: CurrentUser, service: BorrowingSvc
) -> ReservationRead:
    reservation = await service.create_reservation(current_user, payload)
    return ReservationRead.from_entity(reservation)


@router.get("/reservations/me", response_model=list[ReservationRead])
async def list_my_reservations(
    current_user: CurrentUser, service: BorrowingSvc
) -> list[ReservationRead]:
    reservations = await service.list_my_reservations(current_user)
    return [ReservationRead.from_entity(item) for item in reservations]


@router.get("/reservations", response_model=list[ReservationRead])
async def list_reservations(
    _: RequireAdmin,
    service: BorrowingSvc,
    reservation_status: ReservationStatus | None = None,
) -> list[ReservationRead]:
    reservations = await service.list_reservations(reservation_status)
    return [ReservationRead.from_entity(item) for item in reservations]


@router.patch("/reservations/{reservation_id}/approve", response_model=ReservationRead)
async def approve_reservation(
    reservation_id: uuid.UUID, admin: RequireAdmin, service: BorrowingSvc
) -> ReservationRead:
    reservation = await service.approve_reservation(reservation_id, admin)
    return ReservationRead.from_entity(reservation)


@router.delete("/reservations/{reservation_id}", response_model=ReservationRead)
async def cancel_reservation(
    reservation_id: uuid.UUID, current_user: CurrentUser, service: BorrowingSvc
) -> ReservationRead:
    reservation = await service.cancel_reservation(reservation_id, current_user)
    return ReservationRead.from_entity(reservation)


@router.post("/reservations/expire", response_model=TransactionResult)
async def expire_reservations(_: RequireAdmin, service: BorrowingSvc) -> TransactionResult:
    count = await service.expire_reservations()
    return TransactionResult(detail=f"Đã giải phóng {count} phiếu đặt trước hết hạn.")


@router.post(
    "/borrow-records", response_model=BorrowRecordRead, status_code=status.HTTP_201_CREATED
)
async def create_direct_borrow(
    payload: BorrowCreate, _: RequireAdmin, service: BorrowingSvc
) -> BorrowRecordRead:
    borrow = await service.create_direct_borrow(payload)
    return BorrowRecordRead.from_entity(borrow)


@router.post(
    "/borrow-records/from-reservation/{reservation_id}",
    response_model=BorrowRecordRead,
    status_code=status.HTTP_201_CREATED,
)
async def borrow_from_reservation(
    reservation_id: uuid.UUID, _: RequireAdmin, service: BorrowingSvc
) -> BorrowRecordRead:
    borrow = await service.borrow_from_reservation(reservation_id)
    return BorrowRecordRead.from_entity(borrow)


@router.get("/borrow-records/me", response_model=list[BorrowRecordRead])
async def list_my_borrow_records(
    current_user: CurrentUser, service: BorrowingSvc
) -> list[BorrowRecordRead]:
    records = await service.list_my_borrow_records(current_user)
    return [BorrowRecordRead.from_entity(item) for item in records]


@router.get("/borrow-records", response_model=list[BorrowRecordRead])
async def list_borrow_records(_: RequireAdmin, service: BorrowingSvc) -> list[BorrowRecordRead]:
    records = await service.list_borrow_records()
    return [BorrowRecordRead.from_entity(item) for item in records]


@router.patch("/borrow-records/{borrow_id}/renew", response_model=BorrowRecordRead)
async def renew_borrow(
    borrow_id: uuid.UUID, current_user: CurrentUser, service: BorrowingSvc
) -> BorrowRecordRead:
    borrow = await service.renew_borrow(borrow_id, current_user)
    return BorrowRecordRead.from_entity(borrow)


@router.patch("/borrow-records/{borrow_id}/return", response_model=BorrowRecordRead)
async def return_borrow(
    borrow_id: uuid.UUID, _: RequireAdmin, service: BorrowingSvc
) -> BorrowRecordRead:
    borrow = await service.return_borrow(borrow_id)
    return BorrowRecordRead.from_entity(borrow)
