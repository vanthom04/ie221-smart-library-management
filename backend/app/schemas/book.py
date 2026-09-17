from uuid import UUID

from pydantic import BaseModel


class BookBase(BaseModel):
    title: str
    description: str | None = None
    category_id: UUID | None = None
    author_id: UUID | None = None
    publisher_id: UUID | None = None


class BookCreate(BookBase):
    pass


class BookOut(BookBase):
    id: UUID

    class Config:
        from_attributes = True
