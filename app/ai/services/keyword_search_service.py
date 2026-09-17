from typing import List, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.ai.repositories.book_provider import BookDataProvider
from app.ai.schemas import AISearchResult


class KeywordSearchService:
    def __init__(self, book_provider: BookDataProvider) -> None:
        self.book_provider = book_provider

    async def get_ranked_books(self, query: str) -> Tuple[List[int], np.ndarray, dict]:
        books = await self.book_provider.get_all_books()
        if not books:
            return [], np.array([]), {}

        corpus = [
            f"{b['title']} {b.get('author', '')} {b.get('category', '')} {b.get('publisher', '')} {b.get('description', '')} {b.get('isbn', '')}"
            for b in books
        ]
        book_ids = [b["book_id"] for b in books]

        vectorizer = TfidfVectorizer(lowercase=True, token_pattern=r"(?u)\b\w+\b")
        tfidf_matrix = vectorizer.fit_transform(corpus)
        query_vec = vectorizer.transform([query])

        scores = cosine_similarity(tfidf_matrix, query_vec).flatten()
        return book_ids, scores, {b["book_id"]: b for b in books}

    async def search(self, query: str, limit: int = 5) -> List[AISearchResult]:
        book_ids, scores, meta_dict = await self.get_ranked_books(query)
        if len(book_ids) == 0:
            return []

        top_indices = np.argsort(scores)[::-1][:limit]
        results = []
        for idx in top_indices:
            bid = book_ids[idx]
            b = meta_dict[bid]
            score = float(scores[idx])
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