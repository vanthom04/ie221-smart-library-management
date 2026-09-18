from typing import Annotated

from fastapi import APIRouter, Query

from app.api.deps import CurrentUser, RequireAdmin
from app.api.v1.ai.deps import AIIndexingSvc, AIRecommendationSvc, AISearchSvc
from app.schemas.ai_search import (
    AIIndexingRequest,
    AIIndexingResponse,
    AIRecommendationResponse,
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


@router.get("/recommendations", response_model=AIRecommendationResponse)
async def get_recommendations(
    current_user: CurrentUser,
    ai_recommendation_service: AIRecommendationSvc,
    limit: Annotated[int, Query(ge=1, le=20)] = 3,
) -> AIRecommendationResponse:
    return await ai_recommendation_service.recommend_for_user(
        user_id=current_user.id,
        limit=limit,
    )
