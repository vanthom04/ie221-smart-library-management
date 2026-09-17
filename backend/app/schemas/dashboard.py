from pydantic import BaseModel
from typing import List, Optional, Union, Literal

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

class AdminQuickStatResponse(BaseModel):
    id: str
    title: str
    value: str | int
    unit: str | None = None
    change: str | None = None
    icon: str
    tone: str

    class Config:
        from_attributes = True

class AdminPendingRequestResponse(BaseModel):
    id: str
    userName: str
    bookTitle: str
    requestDate: str
    type: Literal["borrow", "return", "renew"]
    status: Literal["pending", "approved", "rejected"]

    class Config:
        from_attributes = True

class AdminRecentBorrowResponse(BaseModel):
    id: str
    userName: str
    bookTitle: str
    borrowDate: str
    dueDate: str
    status: Literal["borrowing", "returned", "overdue"]

    class Config:
        from_attributes = True

class CategoryStatResponse(BaseModel):
    categoryKey: str
    label: str
    count: int
    percentage: int

    class Config:
        from_attributes = True

class BorrowTrend(BaseModel):
    value: str
    direction: Literal["up", "down"]

class BorrowSummaryStatResponse(BaseModel):
    label: str
    value: str
    unit: Optional[str] = None
    trend: Optional[BorrowTrend] = None

    class Config:
        from_attributes = True

class BorrowTrendPoint(BaseModel):
    month: str
    count: float

class BorrowOverviewResponse(BaseModel):
    stats: List[BorrowSummaryStatResponse]
    trend: List[BorrowTrendPoint]