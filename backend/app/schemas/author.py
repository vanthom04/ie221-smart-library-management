
from pydantic import BaseModel


class AuthorBase(BaseModel):
    name: str
    bio: str | None = None

class AuthorCreate(AuthorBase):
    pass

class AuthorOut(AuthorBase):
    id: int

    class Config:
        from_attributes = True