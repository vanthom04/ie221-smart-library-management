import logging
from typing import Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.config import ai_settings
from app.ai.repositories.book_provider import BookDataProvider
from app.ai.repositories.embedding_repository import EmbeddingRepository
from app.ai.services.document_builder import BookDocumentBuilder
from app.ai.services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)


class BookIndexingService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.book_provider = BookDataProvider(session)
        self.emb_repo = EmbeddingRepository(session)
        self.embed_service = EmbeddingService.get_instance()

    async def index_single_book(self, book_id: int) -> Dict[str, str]:
        """
        Dùng làm template cho team BE gắn vào BackgroundTasks khi thêm/sửa sách.
        """
        books = await self.book_provider.get_books_by_ids([book_id])
        if not books:
            return {"status": "error", "message": f"Book ID {book_id} not found."}

        book_data = books[0]
        doc = BookDocumentBuilder.build_document(book_data)
        c_hash = BookDocumentBuilder.compute_hash(doc)

        existing_hashes = await self.emb_repo.get_hashes_map()
        if book_id in existing_hashes and existing_hashes[book_id] == c_hash:
            return {"status": "skipped", "message": f"Book ID {book_id} unchanged."}

        vector = self.embed_service.embed_document(doc, normalize=True)
        payload = [{
            "book_id": book_id,
            "content": doc,
            "content_hash": c_hash,
            "embedding": vector.tolist(),
            "model_name": ai_settings.EMBEDDING_MODEL_NAME,
            "embedding_dimension": ai_settings.EMBEDDING_DIMENSION,
        }]

        await self.emb_repo.upsert_embeddings(payload)
        return {"status": "success", "message": f"Book ID {book_id} indexed."}

    async def index_all_books(self) -> Dict[str, int]:
        """
        Quét và đồng bộ toàn bộ sách chưa có embedding hoặc đã bị thay đổi nội dung.
        """
        books = await self.book_provider.get_all_books()
        existing_hashes = await self.emb_repo.get_hashes_map()

        to_index = []
        for b in books:
            b_id = b["book_id"]
            doc = BookDocumentBuilder.build_document(b)
            c_hash = BookDocumentBuilder.compute_hash(doc)

            if b_id not in existing_hashes or existing_hashes[b_id] != c_hash:
                to_index.append({
                    "book_id": b_id,
                    "content": doc,
                    "content_hash": c_hash,
                })

        if not to_index:
            return {"total_checked": len(books), "indexed": 0, "skipped": len(books)}

        texts = [item["content"] for item in to_index]
        vectors = self.embed_service.embed_documents(texts, normalize=True)

        payload = []
        for i, item in enumerate(to_index):
            payload.append({
                "book_id": item["book_id"],
                "content": item["content"],
                "content_hash": item["content_hash"],
                "embedding": vectors[i].tolist(),
                "model_name": ai_settings.EMBEDDING_MODEL_NAME,
                "embedding_dimension": ai_settings.EMBEDDING_DIMENSION,
            })

        await self.emb_repo.upsert_embeddings(payload)
        return {
            "total_checked": len(books),
            "indexed": len(payload),
            "skipped": len(books) - len(payload),
        }