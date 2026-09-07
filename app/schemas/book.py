from typing import Optional
from pydantic import BaseModel

class BookBase(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    author_id: Optional[int] = None
    publisher_id: Optional[int] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    author_id: Optional[int] = None
    publisher_id: Optional[int] = None

class BookResponse(BookBase):
    id: int

    class Config:
        from_attributes = True