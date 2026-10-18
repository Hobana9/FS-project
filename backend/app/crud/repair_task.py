from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models import Defect, RepairTask
from app.models.enums import TaskStatus
from app.schemas.repair_task import RepairTaskCreate, RepairTaskUpdate

_WITH_RELATIONS = (joinedload(RepairTask.defect).joinedload(Defect.upload),)


def get_task(db: Session, task_id: int) -> RepairTask | None:
    stmt = select(RepairTask).options(*_WITH_RELATIONS).where(RepairTask.id == task_id)
    return db.scalar(stmt)


def get_task_by_defect(db: Session, defect_id: int) -> RepairTask | None:
    stmt = select(RepairTask).where(RepairTask.defect_id == defect_id)
    return db.scalar(stmt)


def list_tasks(
    db: Session,
    *,
    status: TaskStatus | None = None,
    crew: str | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[RepairTask]:
    stmt = select(RepairTask).options(*_WITH_RELATIONS).order_by(RepairTask.due_date, RepairTask.id)

    if status is not None:
        stmt = stmt.where(RepairTask.status == status)
    if crew is not None:
        stmt = stmt.where(RepairTask.crew == crew)

    return list(db.scalars(stmt.offset(skip).limit(limit)))


def create_task(db: Session, data: RepairTaskCreate) -> RepairTask:
    task = RepairTask(**data.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: RepairTask, data: RepairTaskUpdate) -> RepairTask:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: RepairTask) -> None:
    db.delete(task)
    db.commit()
