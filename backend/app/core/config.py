from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Настройки приложения. Значения читаются из переменных окружения или из файла .env."""

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    postgres_host: str = 'localhost'
    postgres_port: int = 5432
    postgres_db: str = 'road_marking'
    postgres_user: str = 'road_marking'
    postgres_password: str = 'road_marking'

    cors_origins: str = 'http://localhost:5173'

    media_dir: str = 'media'
    max_upload_mb: int = 5

    # Какой анализатор снимков использовать
    analyzer: str = 'stub'

    @property
    def media_root(self) -> Path:
        """Каталог, куда складываются загруженные фотографии."""
        return Path(self.media_dir).resolve()

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_mb * 1024 * 1024

    @property
    def database_url(self) -> str:
        return (
            f'postgresql+psycopg://{self.postgres_user}:{self.postgres_password}'
            f'@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}'
        )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(',') if origin.strip()]


settings = Settings()
