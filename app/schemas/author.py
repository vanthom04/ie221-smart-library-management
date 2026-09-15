from pydantic import BaseModel
from typing import Optional

class AuthorBase(BaseModel):
    name: str
    bio: Optional[str] = None

class AuthorCreate(AuthorBase):
    pass

class AuthorOut(AuthorBase):
    id: int

    class Config:
        from_attributes = True