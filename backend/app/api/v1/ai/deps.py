from typing import Annotated

from fastapi import Depends

from app.api.deps import DbSession
from app.repositories.ai_search_repository import AISearchRepository
from app.services.ai_embedding_service import AIEmbeddingService
from app.services.ai_indexing_service import AIIndexingService
from app.services.ai_recommendation_service import AIRecommendationService
from app.services.ai_search_service import AISearchService


def get_ai_search_repository(db: DbSession) -> AISearchRepository:
    return AISearchRepository(db)


AISearchRepo = Annotated[AISearchRepository, Depends(get_ai_search_repository)]


def get_ai_embedding_service() -> AIEmbeddingService:
    return AIEmbeddingService.get_instance()


AIEmbeddingSvc = Annotated[AIEmbeddingService, Depends(get_ai_embedding_service)]


def get_ai_search_service(
    ai_search: AISearchRepo, ai_embedding_service: AIEmbeddingSvc
) -> AISearchService:
    return AISearchService(ai_search, ai_embedding_service)


AISearchSvc = Annotated[AISearchService, Depends(get_ai_search_service)]


def get_ai_indexing_service(
    ai_search: AISearchRepo, ai_embedding_service: AIEmbeddingSvc
) -> AIIndexingService:
    return AIIndexingService(ai_search, ai_embedding_service)


AIIndexingSvc = Annotated[AIIndexingService, Depends(get_ai_indexing_service)]


def get_ai_recommendation_service(ai_search: AISearchRepo) -> AIRecommendationService:
    return AIRecommendationService(ai_search)


AIRecommendationSvc = Annotated[AIRecommendationService, Depends(get_ai_recommendation_service)]
