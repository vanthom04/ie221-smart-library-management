from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.ai.router import router as ai_router
from app.ai.services.embedding_service import EmbeddingService
from app.core.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi tạo embedding model một lần duy nhất vào RAM
    EmbeddingService.get_instance()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="Smart Library AI Backend Service",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(ai_router)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "AI Search & Recommendation"}