import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.ai.config import ai_settings
from app.ai.repositories.book_provider import BookDataProvider
from app.ai.repositories.embedding_repository import EmbeddingRepository
from app.ai.services.document_builder import BookDocumentBuilder
from app.ai.services.embedding_service import EmbeddingService
from app.core.config import app_settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


async def run_indexing() -> None:
    engine = create_async_engine(app_settings.DATABASE_URL, echo=False)
    session_factory = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    logger.info("Initializing SentenceTransformer model cache...")
    embed_service = EmbeddingService.get_instance()

    async with session_factory() as session:
        book_provider = BookDataProvider(session)
        emb_repo = EmbeddingRepository(session)

        logger.info("Fetching book catalog from provider...")
        books = await book_provider.get_all_books()
        existing_hashes = await emb_repo.get_hashes_map()

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
            logger.info("All book embeddings are up-to-date. 0 books regenerated.")
            return

        logger.info(f"Generating vectors for {len(to_index)} new/updated books...")
        texts = [item["content"] for item in to_index]
        vectors = embed_service.embed_documents(texts, normalize=True)

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

        await emb_repo.upsert_embeddings(payload)
        logger.info(f"Successfully indexed {len(payload)} books into book_embeddings table.")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(run_indexing())