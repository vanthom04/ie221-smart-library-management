from pydantic import BaseModel
from uuid import UUID

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