from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- App ---
    PROJECT_NAME: str = "Smart Library Management Backend"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "local"
    BACKEND_CORS_ORIGINS: list[str] = []

    # --- Security ---
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    COOKIE_SECURE: bool = True

    # Database
    DATABASE_URL: str

    # Borrowing core
    RESERVATION_HOLD_DAYS: int = 3
    BORROW_DAYS: int = 14
    RENEWAL_DAYS: int = 7
    MAX_RENEWALS: int = 1

    # AI Search
    AI_EMBEDDING_MODEL_NAME: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    AI_EMBEDDING_DIMENSION: int = 384
    AI_EMBEDDING_DEVICE: str = "cpu"
    AI_EMBEDDING_BATCH_SIZE: int = 32
    AI_SEARCH_TOP_K: int = 5


@lru_cache
def get_settings() -> Settings:
    """Dùng cache để tránh đọc và phân tích lại `.env` ở mỗi lần inject cấu hình."""
    return Settings(**{})


settings = get_settings()
