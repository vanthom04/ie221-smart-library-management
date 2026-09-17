from uuid import UUID

from pydantic import BaseModel


class AuthorBase(BaseModel):
    name: str
    bio: str | None = None


class AuthorCreate(AuthorBase):
    pass


class AuthorOut(AuthorBase):
    id: UUID  # Sửa từ int thành UUID để khớp với database

    class Config:
        from_attributes = True
