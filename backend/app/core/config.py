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

    # Borrowing core
    RESERVATION_HOLD_DAYS: int = 3
    BORROW_DAYS: int = 14
    RENEWAL_DAYS: int = 7
    MAX_RENEWALS: int = 1

    # Upload
    MAX_UPLOAD_SIZE_MB: int = 5

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    CLOUDINARY_UPLOAD_FOLDER: str = "smart-library-management"


@lru_cache
def get_settings() -> Settings:
    """Cấu hình cache để chỉ đọc/parse .env một lần duy nhất."""
    return Settings(**{})


settings = get_settings()
