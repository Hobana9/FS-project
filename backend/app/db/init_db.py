"""Создание таблиц в базе данных.

Запуск из каталога backend:  python -m app.db.init_db
"""

from app.db.base import Base
from app.db.session import engine

# Импорт пакета моделей обязателен: пока классы не выполнены,
# SQLAlchemy не знает о таблицах и создавать будет нечего.
import app.models  # noqa: F401


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == '__main__':
    create_tables()
    print('Таблицы созданы:', ', '.join(sorted(Base.metadata.tables)))
