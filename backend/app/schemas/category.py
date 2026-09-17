from uuid import UUID

from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    description: str | None = None

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: UUID
    class Config:
        from_attributes = True