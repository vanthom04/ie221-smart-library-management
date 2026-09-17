from uuid import UUID

from pydantic import BaseModel


class PublisherBase(BaseModel):
    name: str
    address: str | None = None

class PublisherCreate(PublisherBase):
    pass

class PublisherOut(PublisherBase):
    id: UUID
    class Config:
        from_attributes = True