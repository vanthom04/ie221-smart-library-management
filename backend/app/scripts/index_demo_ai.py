"""Tạo/cập nhật embedding để demo AI Search và Recommendation.

Chạy:
    uv run python -m app.scripts.index_demo_ai
"""

from __future__ import annotations

import asyncio

from app.db.session import AsyncSessionLocal
from app.repositories.ai_search_repository import AISearchRepository
from app.scripts.demo_seed_data import ensure_demo_seed_allowed
from app.services.ai_embedding_service import AIEmbeddingService
from app.services.ai_indexing_service import AIIndexingService


async def index_demo_ai() -> None:
    ensure_demo_seed_allowed()
    async with AsyncSessionLocal() as session:
        repository = AISearchRepository(session)
        service = AIIndexingService(
            ai_search_repository=repository,
            ai_embedding_service=AIEmbeddingService.get_instance(),
        )
        result = await service.index_all_books()
        print(result.message)
        print(f"- Total checked: {result.total_checked}")
        print(f"- Indexed: {result.indexed}")
        print(f"- Skipped: {result.skipped}")


async def main() -> None:
    await index_demo_ai()


if __name__ == "__main__":
    asyncio.run(main())
