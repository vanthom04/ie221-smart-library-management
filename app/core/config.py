from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/library_ai_dev"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


app_settings = AppSettings()