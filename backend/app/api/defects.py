from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_defect_or_404, get_upload_or_404
from app.crud import defect as defect_crud
from app.db.session import get_db
from app.models import Defect, Upload
from app.models.enums import DefectSeverity, DefectType
from app.schemas.defect import DefectCreate, DefectRead, DefectUpdate

router = APIRouter(tags=['Дефекты'])


@router.get('/api/defects', response_model=list[DefectRead], summary='Реестр дефектов')
def list_defects(
    upload_id: int | None = Query(default=None, ge=1, description='Только по этому снимку'),
    type: DefectType | None = Query(default=None, description='Фильтр по типу'),
    severity: DefectSeverity | None = Query(default=None, description='Фильтр по серьёзности'),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
) -> list[Defect]:
    return defect_crud.list_defects(
        db, upload_id=upload_id, type=type, severity=severity, skip=skip, limit=limit
    )


@router.get(
    '/api/uploads/{upload_id}/defects',
    response_model=list[DefectRead],
    summary='Дефекты конкретного снимка',
)
def list_upload_defects(
    upload: Upload = Depends(get_upload_or_404),
    db: Session = Depends(get_db),
) -> list[Defect]:
    return defect_crud.list_defects(db, upload_id=upload.id, limit=200)


@router.post(
    '/api/uploads/{upload_id}/defects',
    response_model=DefectRead,
    status_code=status.HTTP_201_CREATED,
    summary='Добавить дефект к снимку',
)
def create_defect(
    data: DefectCreate,
    upload: Upload = Depends(get_upload_or_404),
    db: Session = Depends(get_db),
) -> Defect:
    return defect_crud.create_defect(db, upload.id, data)


@router.get('/api/defects/{defect_id}', response_model=DefectRead, summary='Дефект по идентификатору')
def get_defect(defect: Defect = Depends(get_defect_or_404)) -> Defect:
    return defect


@router.patch('/api/defects/{defect_id}', response_model=DefectRead, summary='Изменить дефект')
def update_defect(
    data: DefectUpdate,
    defect: Defect = Depends(get_defect_or_404),
    db: Session = Depends(get_db),
) -> Defect:
    return defect_crud.update_defect(db, defect, data)


@router.delete(
    '/api/defects/{defect_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    summary='Удалить дефект вместе с заданием на ремонт',
)
def delete_defect(
    defect: Defect = Depends(get_defect_or_404),
    db: Session = Depends(get_db),
) -> Response:
    defect_crud.delete_defect(db, defect)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
