from uuid import UUID

from pydantic import BaseModel


class BookBase(BaseModel):
    title: str
    isbn: str
    description: str | None = None
    category_id: UUID | None = None
    publisher_id: UUID | None = None
    quantity: int = 1
    available_quantity: int = 1


class BookCreate(BookBase):
    pass


class BookOut(BookBase):
    id: UUID

    class Config:
        from_attributes = True