import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "MB Solar Hub Calculator API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    CORS_ORIGINS: list[str] = ["*"]

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
