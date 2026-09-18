import uuid

from pydantic import BaseModel, Field


class AIIndexedBook(BaseModel):
    """Metadata sách dùng nội bộ cho indexing/search."""

    book_id: uuid.UUID
    title: str
    isbn: str | None = None
    description: str | None = None
    author: str | None = None
    category: str | None = None
    publisher: str | None = None


class AISearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=500)
    limit: int = Field(default=5, ge=1, le=20)


class AISearchResult(BaseModel):
    book_id: uuid.UUID
    title: str
    isbn: str | None = None
    author: str | None = None
    category: str | None = None
    publisher: str | None = None
    score: float


class AISearchResponse(BaseModel):
    query: str
    results: list[AISearchResult]
    total: int


class AIIndexingRequest(BaseModel):
    book_id: uuid.UUID | None = None


class AIIndexingResponse(BaseModel):
    message: str
    total_checked: int
    indexed: int
    skipped: int


class AIRecommendationItem(BaseModel):
    rank: int
    book_id: uuid.UUID
    title: str
    isbn: str | None = None
    author: str | None = None
    category: str | None = None
    publisher: str | None = None
    score: float
    reason: str


class AIRecommendationResponse(BaseModel):
    based_on_books: int
    recommendations: list[AIRecommendationItem]
