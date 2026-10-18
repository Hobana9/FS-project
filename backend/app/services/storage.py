"""Хранение загруженных фотографий участков."""

from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

# Разрешённые типы файлов и расширения, под которыми они сохраняются.
ALLOWED_TYPES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
}

CHUNK_SIZE = 1024 * 1024

MEDIA_URL_PREFIX = '/media'


def save_photo(photo: UploadFile) -> str:
    """Сохраняет фотографию и возвращает URL, по которому её можно получить."""
    extension = ALLOWED_TYPES.get(photo.content_type or '')
    if extension is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail='Допустимы только изображения JPEG или PNG',
        )

    settings.media_root.mkdir(parents=True, exist_ok=True)

    # Имя файла генерируем сами: имя из запроса может содержать
    # что угодно, вплоть до путей вида ../../app/main.py
    filename = f'{uuid4().hex}{extension}'
    path = settings.media_root / filename

    written = 0
    try:
        with path.open('wb') as target:
            while chunk := photo.file.read(CHUNK_SIZE):
                written += len(chunk)
                if written > settings.max_upload_bytes:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f'Файл больше {settings.max_upload_mb} МБ',
                    )
                target.write(chunk)
    except Exception:
        path.unlink(missing_ok=True)
        raise

    if written == 0:
        path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail='Файл пустой',
        )

    return f'{MEDIA_URL_PREFIX}/{filename}'


def delete_photo(photo_url: str) -> None:
    """Удаляет файл по его URL. Чужие и уже отсутствующие файлы игнорируются."""
    prefix = f'{MEDIA_URL_PREFIX}/'
    if not photo_url.startswith(prefix):
        return

    filename = Path(photo_url[len(prefix) :]).name
    (settings.media_root / filename).unlink(missing_ok=True)
