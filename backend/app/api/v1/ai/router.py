from fastapi import APIRouter

from app.api.deps import RequireAdmin
from app.api.v1.ai.deps import AIIndexingSvc, AISearchSvc
from app.schemas.ai_search import (
    AIIndexingRequest,
    AIIndexingResponse,
    AISearchRequest,
    AISearchResponse,
)

router = APIRouter(prefix="/ai", tags=["AI Search"])


@router.post("/search", response_model=AISearchResponse)
async def search_books(
    payload: AISearchRequest, ai_search_service: AISearchSvc
) -> AISearchResponse:
    results = await ai_search_service.search(query=payload.query, limit=payload.limit)
    return AISearchResponse(query=payload.query, results=results, total=len(results))


@router.post("/index-books", response_model=AIIndexingResponse)
async def index_books(
    payload: AIIndexingRequest, _: RequireAdmin, ai_indexing_service: AIIndexingSvc
) -> AIIndexingResponse:
    if payload.book_id is not None:
        return await ai_indexing_service.index_book(payload.book_id)

    return await ai_indexing_service.index_all_books()
