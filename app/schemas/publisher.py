from typing import Optional
from pydantic import BaseModel

class PublisherBase(BaseModel):
    name: str
    address: Optional[str] = None

class PublisherCreate(PublisherBase):
    pass

class PublisherUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None

class PublisherResponse(PublisherBase):
    id: int

    class Config:
        from_attributes = True