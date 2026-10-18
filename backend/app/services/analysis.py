"""Обработка загруженного снимка: запуск анализатора и сохранение результата."""

import logging
from pathlib import Path

from app.core.config import settings
from app.db.session import SessionLocal
from app.models import Defect, Upload
from app.models.enums import UploadStatus
from app.services.analyzer import AnalyzerError, get_analyzer
from app.services.storage import MEDIA_URL_PREFIX

logger = logging.getLogger(__name__)


def photo_path(photo_url: str) -> Path:
    """Переводит URL фотографии в путь к файлу на диске."""
    prefix = f'{MEDIA_URL_PREFIX}/'
    if not photo_url.startswith(prefix):
        raise AnalyzerError(f'Неожиданный адрес фотографии: {photo_url}')
    return settings.media_root / Path(photo_url[len(prefix) :]).name


def analyze_upload(upload_id: int) -> None:
    """Анализирует снимок и записывает найденные дефекты.

    Запускается фоновой задачей уже после того, как ответ отправлен клиенту,
    поэтому открывает собственную сессию: сессия запроса к этому моменту закрыта.
    """
    with SessionLocal() as db:
        upload = db.get(Upload, upload_id)
        if upload is None:
            logger.warning('Снимок %s исчез до начала анализа', upload_id)
            return

        upload.status = UploadStatus.processing
        # Повторный анализ заменяет прежние результаты.
        for defect in list(upload.defects):
            upload.defects.remove(defect)
        db.commit()

        try:
            analyzer = get_analyzer()
            found = analyzer.analyze(photo_path(upload.photo_url))
        except AnalyzerError:
            logger.exception('Не удалось проанализировать снимок %s', upload_id)
            upload.status = UploadStatus.failed
            db.commit()
            return
        except Exception:
            logger.exception('Сбой анализатора на снимке %s', upload_id)
            upload.status = UploadStatus.failed
            db.commit()
            return

        upload.defects = [
            Defect(
                type=item.type,
                severity=item.severity,
                wear_percent=item.wear_percent,
                length_m=item.length_m,
            )
            for item in found
        ]
        upload.status = UploadStatus.processed
        db.commit()

        logger.info(
            'Снимок %s обработан анализатором %s, найдено дефектов: %s',
            upload_id,
            analyzer.name,
            len(found),
        )
