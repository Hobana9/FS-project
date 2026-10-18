from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_upload_or_404
from app.crud import upload as upload_crud
from app.db.session import get_db
from app.models import Upload
from app.models.enums import UploadStatus
from app.schemas.upload import UploadCreate, UploadRead, UploadUpdate

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
    summary='Загрузить снимок',
)
def create_upload(data: UploadCreate, db: Session = Depends(get_db)) -> Upload:
    return upload_crud.create_upload(db, data)


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
    upload_crud.delete_upload(db, upload)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
