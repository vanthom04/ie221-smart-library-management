from uuid import UUID

from pydantic import BaseModel


class BookBase(BaseModel):
    title: str
    isbn: str
    description: str | None = None
    category_id: UUID  # Đã xóa | None = None để bắt buộc nhập, tránh lỗi DB
    publisher_id: UUID | None = None
    quantity: int = 1
    available_quantity: int = 1


class BookCreate(BookBase):
    author_id: UUID | None = None
    author_ids: list[UUID] = []


class BookOut(BookBase):
    id: UUID

    class Config:
        from_attributes = True
