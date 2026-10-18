from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Базовый класс всех моделей. Хранит метаданные таблиц проекта."""
