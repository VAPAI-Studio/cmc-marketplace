"""
CMC IP Marketplace - Configuration
Loads environment variables and provides app settings
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # App
    app_name: str = "CMC IP Marketplace"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = True
    secret_key: str

    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_key: str

    # Anthropic
    anthropic_api_key: str

    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:5174,http://localhost:3000"

    # Storage
    storage_bucket: str = "ip-materials"
    max_file_size_mb: int = 50

    # Sentry
    sentry_dsn: str = ""

    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_period: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )

    @property
    def cors_origins_list(self) -> List[str]:
        """Convert CORS_ORIGINS string to list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]


# Global settings instance
settings = Settings()
