from typing import List, Set
from app.ai.repositories.book_provider import BookDataProvider
from app.ai.repositories.borrow_provider import BorrowHistoryProvider
from app.ai.schemas import RecommendationItem


class PopularityService:
    def __init__(
        self,
        borrow_provider: BorrowHistoryProvider,
        book_provider: BookDataProvider,
    ) -> None:
        self.borrow_provider = borrow_provider
        self.book_provider = book_provider

    async def get_popular_recommendations(
        self, limit: int = 5, exclude_book_ids: Set[int] = None
    ) -> List[RecommendationItem]:
        exclude_book_ids = exclude_book_ids or set()
        borrow_counts = await self.borrow_provider.get_book_borrow_counts()
        all_books = await self.book_provider.get_all_books()

        candidates = [b for b in all_books if b["book_id"] not in exclude_book_ids]
        if not candidates:
            return []

        counts = [borrow_counts.get(b["book_id"], 0) for b in candidates]
        max_c, min_c = max(counts) if counts else 0, min(counts) if counts else 0

        scored = []
        for b in candidates:
            raw_count = borrow_counts.get(b["book_id"], 0)
            norm_score = (raw_count - min_c) / (max_c - min_c) if max_c > min_c else 0.0
            scored.append((b, raw_count, norm_score))

        scored.sort(key=lambda x: (x[1], x[0]["title"]), reverse=True)
        top_candidates = scored[:limit]

        results = []
        for rank, (b, _, score) in enumerate(top_candidates, start=1):
            results.append(
                RecommendationItem(
                    rank=rank,
                    book_id=b["book_id"],
                    title=b["title"],
                    isbn=b.get("isbn"),
                    author=b.get("author"),
                    category=b.get("category"),
                    score=round(score, 4),
                    reason="Popular books",
                )
            )
        return results