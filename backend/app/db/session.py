from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

engine = create_engine(settings.database_url, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_db() -> Generator[Session, None, None]:
    """Зависимость FastAPI: открывает сессию на время запроса и закрывает её после ответа."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
