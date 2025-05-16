from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # База данных
    DATABASE_URL: str = "sqlite+aiosqlite:///./app.db"
    
    # Безопасность
    SECRET_KEY: str = "your-secret-key-here"  # В продакшене заменить на реальный секретный ключ
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Пути
    BASE_DIR: Path = Path(__file__).parent
    STORAGE_DIR: Path = BASE_DIR / "storage"
    
    # Настройки приложения
    APP_NAME: str = "YUMA Center API"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost", "http://localhost:8000"]
    
    class Config:
        case_sensitive = True


settings = Settings()

# Создаем необходимые директории
settings.STORAGE_DIR.mkdir(parents=True, exist_ok=True) 