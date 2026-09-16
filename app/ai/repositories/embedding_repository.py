from typing import Dict, List, Tuple
import numpy as np
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.models.book_embedding import BookEmbedding


class EmbeddingRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_hashes_map(self) -> Dict[int, str]:
        stmt = select(BookEmbedding.book_id, BookEmbedding.content_hash)
        res = await self.session.execute(stmt)
        return {row.book_id: row.content_hash for row in res}

    async def upsert_embeddings(self, records: List[Dict]) -> None:
        if not records:
            return
        for r in records:
            stmt = select(BookEmbedding).where(BookEmbedding.book_id == r["book_id"])
            existing = (await self.session.execute(stmt)).scalar_one_or_none()
            if existing:
                existing.content = r["content"]
                existing.embedding = r["embedding"]
                existing.model_name = r["model_name"]
                existing.embedding_dimension = r["embedding_dimension"]
                existing.content_hash = r["content_hash"]
            else:
                self.session.add(BookEmbedding(**r))
        await self.session.commit()

    async def search_vector_cosine(self, query_vec: np.ndarray, top_k: int) -> List[Tuple[int, float]]:
        # Chuyển numpy array sang list float thuần Python
        vec_list = query_vec.tolist()

        # Dùng phương thức cosine_distance() chính chủ từ pgvector-sqlalchemy
        # Khoảng cách cosine = 1 - similarity -> similarity = 1 - distance
        distance_expr = BookEmbedding.embedding.cosine_distance(vec_list)
        stmt = (
            select(
                BookEmbedding.book_id,
                (1 - distance_expr).label("similarity")
            )
            .order_by(distance_expr.asc())
            .limit(top_k)
        )
        result = await self.session.execute(stmt)
        return [(int(row.book_id), float(row.similarity)) for row in result]

    async def get_all_embeddings(self) -> Dict[int, np.ndarray]:
        stmt = select(BookEmbedding.book_id, BookEmbedding.embedding)
        res = await self.session.execute(stmt)
        return {row.book_id: np.array(row.embedding, dtype=np.float32) for row in res}