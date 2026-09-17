import numpy as np
from sentence_transformers import SentenceTransformer

from app.core.config import settings


class AIEmbeddingService:
    """Lazy singleton bọc SentenceTransformer."""

    _instance: "AIEmbeddingService | None" = None

    def __init__(self) -> None:
        self._model = SentenceTransformer(
            settings.AI_EMBEDDING_MODEL_NAME, device=settings.AI_EMBEDDING_DEVICE
        )

        dimension = self._model.get_sentence_embedding_dimension()
        if dimension != settings.AI_EMBEDDING_DIMENSION:
            raise RuntimeError(
                "Embedding dimension mismatch: "
                f"model={dimension}, configured={settings.AI_EMBEDDING_DIMENSION}"
            )

    @classmethod
    def get_instance(cls) -> "AIEmbeddingService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def embed_query(self, query: str) -> np.ndarray:
        return self.embed_documents([query])[0]

    def embed_document(self, text: str) -> np.ndarray:
        return self.embed_documents([text])[0]

    def embed_documents(self, texts: list[str]) -> np.ndarray:
        if not texts:
            return np.empty((0, settings.AI_EMBEDDING_DIMENSION), dtype=np.float32)

        vectors = self._model.encode(
            texts,
            batch_size=settings.AI_EMBEDDING_BATCH_SIZE,
            show_progress_bar=False,
            normalize_embeddings=True,
            convert_to_numpy=True,
            device=settings.AI_EMBEDDING_DEVICE,
        )
        return vectors.astype(np.float32)
