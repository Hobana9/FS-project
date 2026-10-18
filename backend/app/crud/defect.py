from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models import Defect
from app.models.enums import DefectSeverity, DefectType
from app.schemas.defect import DefectCreate, DefectUpdate

# Дефект почти всегда показывается вместе с адресом снимка и сведениями
# о задании, поэтому обе связи подгружаются сразу.
_WITH_RELATIONS = (joinedload(Defect.upload), joinedload(Defect.task))


def get_defect(db: Session, defect_id: int) -> Defect | None:
    stmt = select(Defect).options(*_WITH_RELATIONS).where(Defect.id == defect_id)
    return db.scalar(stmt)


def list_defects(
    db: Session,
    *,
    upload_id: int | None = None,
    type: DefectType | None = None,
    severity: DefectSeverity | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[Defect]:
    stmt = select(Defect).options(*_WITH_RELATIONS).order_by(Defect.id)

    if upload_id is not None:
        stmt = stmt.where(Defect.upload_id == upload_id)
    if type is not None:
        stmt = stmt.where(Defect.type == type)
    if severity is not None:
        stmt = stmt.where(Defect.severity == severity)

    return list(db.scalars(stmt.offset(skip).limit(limit)))


def create_defect(db: Session, upload_id: int, data: DefectCreate) -> Defect:
    defect = Defect(upload_id=upload_id, **data.model_dump())
    db.add(defect)
    db.commit()
    db.refresh(defect)
    return defect


def update_defect(db: Session, defect: Defect, data: DefectUpdate) -> Defect:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(defect, field, value)
    db.commit()
    db.refresh(defect)
    return defect


def delete_defect(db: Session, defect: Defect) -> None:
    db.delete(defect)
    db.commit()
