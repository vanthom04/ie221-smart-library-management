from typing import Annotated

from fastapi import Depends

from app.api.deps import DbSession
from app.repositories.ai_search_repository import AISearchRepository
from app.services.ai_embedding_service import AIEmbeddingService
from app.services.ai_indexing_service import AIIndexingService
from app.services.ai_search_service import AISearchService


def get_ai_search_service(db: DbSession) -> AISearchService:
    return AISearchService(
        repository=AISearchRepository(db),
        embedding_service=AIEmbeddingService.get_instance(),
    )


AISearchSvc = Annotated[AISearchService, Depends(get_ai_search_service)]


def get_ai_indexing_service(db: DbSession) -> AIIndexingService:
    return AIIndexingService(
        repository=AISearchRepository(db),
        embedding_service=AIEmbeddingService.get_instance(),
    )


AIIndexingSvc = Annotated[AIIndexingService, Depends(get_ai_indexing_service)]
