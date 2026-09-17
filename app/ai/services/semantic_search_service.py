from typing import List
from app.ai.repositories.book_provider import BookDataProvider
from app.ai.repositories.embedding_repository import EmbeddingRepository
from app.ai.schemas import AISearchResult
from app.ai.services.embedding_service import EmbeddingService


class SemanticSearchService:
    def __init__(
        self,
        embedding_repo: EmbeddingRepository,
        book_provider: BookDataProvider,
        embed_service: EmbeddingService,
    ) -> None:
        self.embedding_repo = embedding_repo
        self.book_provider = book_provider
        self.embed_service = embed_service

    async def search(self, query: str, limit: int = 5) -> List[AISearchResult]:
        query_vec = self.embed_service.embed_query(query, normalize=True)
        top_matches = await self.embedding_repo.search_vector_cosine(query_vec, top_k=limit)
        if not top_matches:
            return []

        book_ids = [bid for bid, _ in top_matches]
        scores = {bid: score for bid, score in top_matches}

        books_meta = await self.book_provider.get_books_by_ids(book_ids)
        meta_dict = {b["book_id"]: b for b in books_meta}

        results = []
        for bid in book_ids:
            if bid in meta_dict:
                b = meta_dict[bid]
                results.append(
                    AISearchResult(
                        book_id=b["book_id"],
                        title=b["title"],
                        isbn=b.get("isbn"),
                        author=b.get("author"),
                        category=b.get("category"),
                        publisher=b.get("publisher"),
                        score=round(scores[bid], 4),
                    )
                )
        return results