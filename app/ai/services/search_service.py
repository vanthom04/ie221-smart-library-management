from typing import List
from app.ai.config import SearchMode
from app.ai.schemas import AISearchResult
from app.ai.services.hybrid_search_service import HybridSearchService
from app.ai.services.keyword_search_service import KeywordSearchService
from app.ai.services.semantic_search_service import SemanticSearchService


class SearchService:
    def __init__(
        self,
        semantic_service: SemanticSearchService,
        hybrid_service: HybridSearchService,
        keyword_service: KeywordSearchService,
    ) -> None:
        self.semantic_service = semantic_service
        self.hybrid_service = hybrid_service
        self.keyword_service = keyword_service

    async def search(self, query: str, mode: SearchMode, limit: int) -> List[AISearchResult]:
        if mode == SearchMode.SEMANTIC:
            return await self.semantic_service.search(query, limit)
        elif mode == SearchMode.HYBRID:
            return await self.hybrid_service.search(query, limit)
        elif mode == SearchMode.KEYWORD:
            return await self.keyword_service.search(query, limit)
        raise ValueError(f"Unsupported search mode: {mode}")