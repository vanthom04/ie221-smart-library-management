from typing import List
import numpy as np
from app.ai.config import ai_settings
from app.ai.repositories.book_provider import BookDataProvider
from app.ai.repositories.embedding_repository import EmbeddingRepository
from app.ai.schemas import AISearchResult
from app.ai.services.embedding_service import EmbeddingService
from app.ai.services.keyword_search_service import KeywordSearchService


class HybridSearchService:
    def __init__(
        self,
        embedding_repo: EmbeddingRepository,
        book_provider: BookDataProvider,
        embed_service: EmbeddingService,
        keyword_service: KeywordSearchService,
    ) -> None:
        self.embedding_repo = embedding_repo
        self.book_provider = book_provider
        self.embed_service = embed_service
        self.keyword_service = keyword_service

    async def search(self, query: str, limit: int = 5) -> List[AISearchResult]:
        all_embeddings = await self.embedding_repo.get_all_embeddings()
        if not all_embeddings:
            return []

        book_ids = list(all_embeddings.keys())
        emb_matrix = np.array([all_embeddings[bid] for bid in book_ids])
        query_vec = self.embed_service.embed_query(query, normalize=True)

        sem_scores = np.dot(emb_matrix, query_vec)
        sem_ranked_indices = np.argsort(sem_scores)[::-1]
        sem_rank_map = {book_ids[idx]: rank for rank, idx in enumerate(sem_ranked_indices, start=1)}

        kw_book_ids, kw_scores, meta_dict = await self.keyword_service.get_ranked_books(query)
        kw_score_map = dict(zip(kw_book_ids, kw_scores))
        kw_ranked_indices = np.argsort(kw_scores)[::-1]
        kw_rank_map = {kw_book_ids[idx]: rank for rank, idx in enumerate(kw_ranked_indices, start=1)}

        rrf_k = ai_settings.RRF_K
        w_sem = ai_settings.RRF_SEMANTIC_WEIGHT
        w_kw = ai_settings.RRF_KEYWORD_WEIGHT
        kw_threshold = ai_settings.KEYWORD_MIN_THRESHOLD
        sem_depth = ai_settings.SEMANTIC_AGREEMENT_DEPTH

        rrf_scores = []
        for bid in book_ids:
            sem_rank = sem_rank_map[bid]
            sem_comp = w_sem / (rrf_k + sem_rank)

            kw_score = kw_score_map.get(bid, 0.0)
            kw_rank = kw_rank_map.get(bid, len(book_ids) + 1)

            if kw_score >= kw_threshold and sem_rank <= sem_depth:
                kw_comp = w_kw / (rrf_k + kw_rank)
            else:
                kw_comp = 0.0

            total_rrf = sem_comp + kw_comp
            rrf_scores.append((bid, total_rrf))

        rrf_scores.sort(key=lambda x: x[1], reverse=True)
        top_picks = rrf_scores[:limit]

        if not meta_dict:
            books_meta = await self.book_provider.get_books_by_ids([b for b, _ in top_picks])
            meta_dict = {b["book_id"]: b for b in books_meta}

        results = []
        for bid, score in top_picks:
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
                        score=round(score, 4),
                    )
                )
        return results