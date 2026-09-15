from pydantic import BaseModel
from typing import Optional

class PublisherBase(BaseModel):
    name: str
    address: Optional[str] = None

class PublisherCreate(PublisherBase):
    pass

class PublisherOut(PublisherBase):
    id: int

    class Config:
        from_attributes = True