from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Cấu hình toàn cục, đọc từ file .env"""

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


@lru_cache
def get_settings() -> Settings:
    """Cấu hình cache để chỉ đọc/parse .env một lần duy nhất."""
    return Settings(**{})


settings = get_settings()
