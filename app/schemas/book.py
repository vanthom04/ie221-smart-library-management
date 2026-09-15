from pydantic import BaseModel
from typing import Optional

class BookBase(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    author_id: Optional[int] = None
    publisher_id: Optional[int] = None

class BookCreate(BookBase):
    pass

class BookOut(BookBase):
    id: int

    class Config:
        from_attributes = True