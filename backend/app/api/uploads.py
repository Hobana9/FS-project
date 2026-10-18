from datetime import date
from typing import Annotated

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    Form,
    Query,
    Response,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.api.deps import get_upload_or_404
from app.crud import upload as upload_crud
from app.db.session import get_db
from app.models import Upload
from app.models.enums import UploadStatus
from app.schemas.upload import UploadCreate, UploadRead, UploadUpdate
from app.services import storage
from app.services.analysis import analyze_upload

router = APIRouter(prefix='/api/uploads', tags=['Загрузки'])


@router.get('', response_model=list[UploadRead], summary='Список снимков')
def list_uploads(
    status: UploadStatus | None = Query(default=None, description='Фильтр по статусу обработки'),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
) -> list[Upload]:
    return upload_crud.list_uploads(db, status=status, skip=skip, limit=limit)


@router.post(
    '',
    response_model=UploadRead,
    status_code=status.HTTP_201_CREATED,
    summary='Загрузить снимок участка',
)
def create_upload(
    street: Annotated[str, Form(description='Улица')],
    section: Annotated[str, Form(description='Участок или ориентир')],
    captured_at: Annotated[date, Form(description='Дата съёмки')],
    uploaded_by: Annotated[str, Form(description='Кто загрузил снимок')],
    photo: Annotated[UploadFile, File(description='Фотография участка, JPEG или PNG')],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> Upload:
    photo_url = storage.save_photo(photo)
    try:
        data = UploadCreate(
            street=street,
            section=section,
            captured_at=captured_at,
            uploaded_by=uploaded_by,
            photo_url=photo_url,
        )
    except Exception:
        # Данные не прошли проверку — удаляем уже сохранённый файл,
        # чтобы он не остался в media без записи в базе.
        storage.delete_photo(photo_url)
        raise

    upload = upload_crud.create_upload(db, data)
    # Анализ запускается после отправки ответа: клиент получает снимок
    # со статусом processing и не ждёт завершения обработки.
    background_tasks.add_task(analyze_upload, upload.id)
    return upload


@router.post(
    '/{upload_id}/analyze',
    status_code=status.HTTP_202_ACCEPTED,
    summary='Запустить повторный анализ снимка',
    description='Прежние найденные дефекты и связанные с ними задания будут заменены.',
)
def reanalyze_upload(
    background_tasks: BackgroundTasks,
    upload: Upload = Depends(get_upload_or_404),
) -> dict[str, str]:
    background_tasks.add_task(analyze_upload, upload.id)
    return {'detail': f'Снимок {upload.id} поставлен в очередь на обработку'}


@router.get('/{upload_id}', response_model=UploadRead, summary='Снимок по идентификатору')
def get_upload(upload: Upload = Depends(get_upload_or_404)) -> Upload:
    return upload


@router.patch('/{upload_id}', response_model=UploadRead, summary='Изменить снимок')
def update_upload(
    data: UploadUpdate,
    upload: Upload = Depends(get_upload_or_404),
    db: Session = Depends(get_db),
) -> Upload:
    return upload_crud.update_upload(db, upload, data)


@router.delete(
    '/{upload_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    summary='Удалить снимок вместе с его дефектами',
)
def delete_upload(
    upload: Upload = Depends(get_upload_or_404),
    db: Session = Depends(get_db),
) -> Response:
    photo_url = upload.photo_url
    upload_crud.delete_upload(db, upload)
    storage.delete_photo(photo_url)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
