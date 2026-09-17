import asyncio
import hashlib
import uuid

from app.core.config import settings
from app.core.exceptions import ResourceNotFoundError
from app.repositories.ai_search_repository import AISearchRepository
from app.schemas.ai_search import AIIndexedBook, AIIndexingResponse
from app.services.ai_embedding_service import AIEmbeddingService


class AIIndexingService:
    """Đồng bộ metadata sách sang bảng vector embeddings."""

    def __init__(
        self,
        repository: AISearchRepository,
        embedding_service: AIEmbeddingService,
    ) -> None:
        self._repository = repository
        self._embedding_service = embedding_service

    @staticmethod
    def _build_document(book: AIIndexedBook) -> str:
        return (
            f"Title: {book.title}\n"
            f"Author: {book.author or ''}\n"
            f"Category: {book.category or ''}\n"
            f"Publisher: {book.publisher or ''}\n"
            f"ISBN: {book.isbn or ''}\n"
            f"Description: {book.description or ''}"
        ).strip()

    @staticmethod
    def _compute_hash(content: str) -> str:
        return hashlib.sha256(content.encode("utf-8")).hexdigest()

    async def index_book(self, book_id: uuid.UUID) -> AIIndexingResponse:
        books = await self._repository.get_books_by_ids([book_id])
        if not books:
            raise ResourceNotFoundError("Không tìm thấy sách cần lập chỉ mục!")

        book = books[0]
        content = self._build_document(book)
        content_hash = self._compute_hash(content)
        hashes = await self._repository.get_embedding_hashes()

        if hashes.get(book_id) == content_hash:
            return AIIndexingResponse(
                message="Embedding của sách đã là phiên bản mới nhất.",
                total_checked=1,
                indexed=0,
                skipped=1,
            )

        vector = await asyncio.to_thread(self._embedding_service.embed_document, content)

        async with self._repository.transaction():
            await self._repository.upsert_embedding(
                book_id=book.book_id,
                content=content,
                embedding=vector.tolist(),
                model_name=settings.AI_EMBEDDING_MODEL_NAME,
                content_hash=content_hash,
            )

        return AIIndexingResponse(
            message="Đã lập chỉ mục sách thành công.",
            total_checked=1,
            indexed=1,
            skipped=0,
        )

    async def index_all_books(self) -> AIIndexingResponse:
        books = await self._repository.list_books_for_indexing()
        hashes = await self._repository.get_embedding_hashes()

        pending: list[tuple[AIIndexedBook, str, str]] = []
        for book in books:
            content = self._build_document(book)
            content_hash = self._compute_hash(content)

            if hashes.get(book.book_id) != content_hash:
                pending.append((book, content, content_hash))

        if not pending:
            return AIIndexingResponse(
                message="Toàn bộ embedding đã là phiên bản mới nhất.",
                total_checked=len(books),
                indexed=0,
                skipped=len(books),
            )

        contents = [content for _, content, _ in pending]
        vectors = await asyncio.to_thread(self._embedding_service.embed_documents, contents)

        async with self._repository.transaction():
            for (book, content, content_hash), vector in zip(
                pending,
                vectors,
                strict=True,
            ):
                await self._repository.upsert_embedding(
                    book_id=book.book_id,
                    content=content,
                    embedding=vector.tolist(),
                    model_name=settings.AI_EMBEDDING_MODEL_NAME,
                    content_hash=content_hash,
                )

        return AIIndexingResponse(
            message="Đã đồng bộ embedding cho catalog sách.",
            total_checked=len(books),
            indexed=len(pending),
            skipped=len(books) - len(pending),
        )
