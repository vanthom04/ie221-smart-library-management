from typing import List
import numpy as np
from sentence_transformers import SentenceTransformer
from app.ai.config import ai_settings


class EmbeddingService:
    _instance: "EmbeddingService | None" = None

    def __init__(self) -> None:
        self.device = ai_settings.EMBEDDING_DEVICE
        self.model_name = ai_settings.EMBEDDING_MODEL_NAME
        self.model = SentenceTransformer(self.model_name, device=self.device)
        self.dimension = self.model.get_sentence_embedding_dimension()

    @classmethod
    def get_instance(cls) -> "EmbeddingService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def embed_query(self, query: str, normalize: bool = True) -> np.ndarray:
        return self.embed_documents([query], normalize=normalize)[0]

    def embed_document(self, text: str, normalize: bool = True) -> np.ndarray:
        return self.embed_documents([text], normalize=normalize)[0]

    def embed_documents(self, texts: List[str], normalize: bool = True) -> np.ndarray:
        if not texts:
            return np.empty((0, self.dimension), dtype=np.float32)
        embeddings = self.model.encode(
            texts,
            batch_size=ai_settings.BATCH_SIZE,
            show_progress_bar=False,
            normalize_embeddings=normalize,
            convert_to_numpy=True,
            device=self.device,
        )
        return embeddings.astype(np.float32)