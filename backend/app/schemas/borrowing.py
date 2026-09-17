import uuid
from datetime import UTC, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.borrow_record import BorrowRecord, BorrowStatus
from app.models.reservation import Reservation, ReservationStatus


class BookQuantityInput(BaseModel):
    book_id: uuid.UUID
    quantity: int = Field(default=1, ge=1, le=10)


class ReservationCreate(BaseModel):
    items: list[BookQuantityInput] = Field(min_length=1, max_length=5)

    @model_validator(mode="after")
    def ensure_unique_books(self):
        book_ids = [item.book_id for item in self.items]
        if len(book_ids) != len(set(book_ids)):
            raise ValueError("Mỗi đầu sách chỉ được xuất hiện một lần")
        return self


class ReservationReject(BaseModel):
    reason: str = Field(min_length=3, max_length=500)


class BorrowCreate(BaseModel):
    user_id: uuid.UUID
    items: list[BookQuantityInput] = Field(min_length=1, max_length=5)

    @model_validator(mode="after")
    def ensure_unique_books(self):
        book_ids = [item.book_id for item in self.items]
        if len(book_ids) != len(set(book_ids)):
            raise ValueError("Mỗi đầu sách chỉ được xuất hiện một lần")
        return self


class ReservationItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    book_id: uuid.UUID
    title: str
    isbn: str
    quantity: int


class ReservationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    status: ReservationStatus
    expires_at: datetime | None
    reviewed_at: datetime | None
    reviewed_by: uuid.UUID | None
    rejection_reason: str | None
    fulfilled_at: datetime | None
    created_at: datetime
    items: list[ReservationItemRead]

    @classmethod
    def from_entity(cls, reservation: Reservation) -> "ReservationRead":
        return cls(
            id=reservation.id,
            user_id=reservation.user_id,
            status=reservation.status,
            expires_at=reservation.expires_at,
            reviewed_at=reservation.reviewed_at,
            reviewed_by=reservation.reviewed_by,
            rejection_reason=reservation.rejection_reason,
            fulfilled_at=reservation.fulfilled_at,
            created_at=reservation.created_at,
            items=[
                ReservationItemRead(
                    id=item.id,
                    book_id=item.book_id,
                    title=item.book.title,
                    isbn=item.book.isbn,
                    quantity=item.quantity,
                )
                for item in reservation.items
            ],
        )


class BorrowItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    book_id: uuid.UUID
    title: str
    isbn: str
    quantity: int
    returned: bool


class BorrowRecordRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    reservation_id: uuid.UUID | None
    borrow_date: datetime
    due_date: datetime
    return_date: datetime | None
    renewal_count: int
    renewed_at: datetime | None
    status: BorrowStatus
    created_at: datetime
    items: list[BorrowItemRead]

    @classmethod
    def from_entity(cls, borrow: BorrowRecord) -> "BorrowRecordRead":
        status = borrow.status

        if status == BorrowStatus.BORROWING and borrow.due_date < datetime.now(UTC):
            status = BorrowStatus.OVERDUE

        return cls(
            id=borrow.id,
            user_id=borrow.user_id,
            reservation_id=borrow.reservation_id,
            borrow_date=borrow.borrow_date,
            due_date=borrow.due_date,
            return_date=borrow.return_date,
            renewal_count=borrow.renewal_count,
            renewed_at=borrow.renewed_at,
            status=status,
            created_at=borrow.created_at,
            items=[
                BorrowItemRead(
                    id=item.id,
                    book_id=item.book_id,
                    title=item.book.title,
                    isbn=item.book.isbn,
                    quantity=item.quantity,
                    returned=item.returned,
                )
                for item in borrow.items
            ],
        )


class TransactionResult(BaseModel):
    detail: str
