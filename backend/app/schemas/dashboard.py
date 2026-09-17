from pydantic import BaseModel
from typing import Optional, Union, Literal

class DashboardQuickStatResponse(BaseModel):
    id: str
    title: str
    value: Union[int, str]
    unit: Optional[str] = None
    icon: str
    tone: str
    href: str

    class Config:
        from_attributes = True

class BorrowedBookResponse(BaseModel):
    id: str
    title: str
    author: str
    coverUrl: str
    dueDate: str
    daysLeft: int

    class Config:
        from_attributes = True

class ActivityItemResponse(BaseModel):
    id: str
    iconTone: Literal["green", "blue", "red", "yellow"]
    description: str
    bookTitle: str
    date: str
    time: str

    class Config:
        from_attributes = True

class DueSoonBookResponse(BaseModel):
    id: str
    title: str
    dueDate: str
    daysLeft: int
    coverUrl: str

    class Config:
        from_attributes = True