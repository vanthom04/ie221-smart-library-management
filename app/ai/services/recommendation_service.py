from typing import List, Tuple
import numpy as np
from app.ai.repositories.book_provider import BookDataProvider
from app.ai.repositories.embedding_repository import EmbeddingRepository
from app.ai.schemas import RecommendationItem
from app.ai.services.popularity_service import PopularityService


class RecommendationService:
    def __init__(
        self,
        embedding_repo: EmbeddingRepository,
        book_provider: BookDataProvider,
        popularity_service: PopularityService,
    ) -> None:
        self.embedding_repo = embedding_repo
        self.book_provider = book_provider
        self.popularity_service = popularity_service

    async def recommend_by_books(
        self,
        book_ids: List[int],
        limit: int = 5,
    ) -> Tuple[int, List[RecommendationItem]]:
        """
        Gợi ý sách dựa trên danh sách ID sách đầu vào.
        Trả về: (số_lượng_sách_đầu_vào, danh_sách_gợi_ý)
        """
        clean_ids = list(set(book_ids))
        input_count = len(clean_ids)
        input_set = set(clean_ids)

        # 1. Nếu không truyền sách nào -> Trả về sách phổ biến (Cold-start)
        if not input_set:
            popular_recs = await self.popularity_service.get_popular_recommendations(limit=limit)
            return input_count, popular_recs

        all_embeddings = await self.embedding_repo.get_all_embeddings()
        if not all_embeddings:
            popular_recs = await self.popularity_service.get_popular_recommendations(limit=limit)
            return input_count, popular_recs

        # 2. Lấy vector các sách đầu vào
        history_vectors = [all_embeddings[bid] for bid in input_set if bid in all_embeddings]
        if not history_vectors:
            popular_recs = await self.popularity_service.get_popular_recommendations(limit=limit)
            return input_count, popular_recs

        # 3. Tính Vector Centroid (tâm điểm sở thích)
        centroid_vector = np.mean(history_vectors, axis=0)
        norm = np.linalg.norm(centroid_vector)
        if norm > 0:
            centroid_vector = centroid_vector / norm

        # 4. Loại trừ các sách đầu vào và chấm điểm Cosine Similarity với kho sách
        candidate_bids = [bid for bid in all_embeddings.keys() if bid not in input_set]
        if not candidate_bids:
            return input_count, []

        cand_matrix = np.array([all_embeddings[bid] for bid in candidate_bids])
        sims = np.dot(cand_matrix, centroid_vector)

        ranked_indices = np.argsort(sims)[::-1][:limit]
        top_candidates = [(candidate_bids[i], float(sims[i])) for i in ranked_indices]

        candidate_meta = await self.book_provider.get_books_by_ids([bid for bid, _ in top_candidates])
        meta_dict = {b["book_id"]: b for b in candidate_meta}

        recommendations = []
        for rank, (bid, sim) in enumerate(top_candidates, start=1):
            if bid in meta_dict:
                b = meta_dict[bid]
                recommendations.append(
                    RecommendationItem(
                        rank=rank,
                        book_id=b["book_id"],
                        title=b["title"],
                        isbn=b.get("isbn"),
                        author=b.get("author"),
                        category=b.get("category"),
                        score=round(sim, 4),
                        reason=f"Based on {input_count} related book(s)",
                    )
                )

        return input_count, recommendations