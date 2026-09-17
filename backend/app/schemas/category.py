from pydantic import BaseModel
from uuid import UUID

class CategoryBase(BaseModel):
    name: str
    description: str | None = None

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: UUID
    class Config:
        from_attributes = True