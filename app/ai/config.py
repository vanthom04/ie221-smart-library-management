from enum import StrEnum
from pydantic_settings import BaseSettings, SettingsConfigDict


class SearchMode(StrEnum):
    SEMANTIC = "semantic"
    HYBRID = "hybrid"
    KEYWORD = "keyword"


class AISettings(BaseSettings):
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    EMBEDDING_DIMENSION: int = 384
    EMBEDDING_DEVICE: str = "cpu"
    BATCH_SIZE: int = 32

    DEFAULT_SEARCH_MODE: SearchMode = SearchMode.SEMANTIC
    SEARCH_TOP_K: int = 5
    RECOMMENDATION_TOP_K: int = 5

    # Hybrid Search RRF & Gate Parameters
    RRF_K: int = 60
    RRF_SEMANTIC_WEIGHT: float = 1.0
    RRF_KEYWORD_WEIGHT: float = 0.5
    KEYWORD_MIN_THRESHOLD: float = 0.30
    SEMANTIC_AGREEMENT_DEPTH: int = 10

    # Recommendation Parameters
    REC_WEIGHT_CONTENT: float = 0.7
    REC_WEIGHT_POPULARITY: float = 0.3

    model_config = SettingsConfigDict(env_prefix="AI_", env_file=".env", extra="ignore")


ai_settings = AISettings()