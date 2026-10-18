from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_task_or_404
from app.crud import defect as defect_crud
from app.crud import repair_task as task_crud
from app.db.session import get_db
from app.models import RepairTask
from app.models.enums import TaskStatus
from app.schemas.repair_task import RepairTaskCreate, RepairTaskRead, RepairTaskUpdate

router = APIRouter(prefix='/api/tasks', tags=['Задания на ремонт'])


@router.get('', response_model=list[RepairTaskRead], summary='Список заданий')
def list_tasks(
    status: TaskStatus | None = Query(default=None, description='Фильтр по состоянию'),
    crew: str | None = Query(default=None, description='Фильтр по исполнителю'),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
) -> list[RepairTask]:
    return task_crud.list_tasks(db, status=status, crew=crew, skip=skip, limit=limit)


@router.post(
    '',
    response_model=RepairTaskRead,
    status_code=status.HTTP_201_CREATED,
    summary='Создать задание по дефекту',
)
def create_task(data: RepairTaskCreate, db: Session = Depends(get_db)) -> RepairTask:
    if defect_crud.get_defect(db, data.defect_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Дефект с id={data.defect_id} не найден',
        )

    existing = task_crud.get_task_by_defect(db, data.defect_id)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f'По дефекту {data.defect_id} уже создано задание (id={existing.id})',
        )

    return task_crud.create_task(db, data)


@router.get('/{task_id}', response_model=RepairTaskRead, summary='Задание по идентификатору')
def get_task(task: RepairTask = Depends(get_task_or_404)) -> RepairTask:
    return task


@router.patch('/{task_id}', response_model=RepairTaskRead, summary='Изменить задание')
def update_task(
    data: RepairTaskUpdate,
    task: RepairTask = Depends(get_task_or_404),
    db: Session = Depends(get_db),
) -> RepairTask:
    return task_crud.update_task(db, task, data)


@router.delete(
    '/{task_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    summary='Отменить задание',
)
def delete_task(
    task: RepairTask = Depends(get_task_or_404),
    db: Session = Depends(get_db),
) -> Response:
    task_crud.delete_task(db, task)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
