from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models import Upload
from app.models.enums import UploadStatus
from app.schemas.upload import UploadCreate, UploadUpdate


def get_upload(db: Session, upload_id: int) -> Upload | None:
    stmt = select(Upload).options(selectinload(Upload.defects)).where(Upload.id == upload_id)
    return db.scalar(stmt)


def list_uploads(
    db: Session,
    *,
    status: UploadStatus | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[Upload]:
    stmt = (
        select(Upload)
        .options(selectinload(Upload.defects))
        .order_by(Upload.captured_at.desc(), Upload.id.desc())
    )
    if status is not None:
        stmt = stmt.where(Upload.status == status)
    return list(db.scalars(stmt.offset(skip).limit(limit)))


def create_upload(db: Session, data: UploadCreate) -> Upload:
    upload = Upload(**data.model_dump())
    db.add(upload)
    db.commit()
    db.refresh(upload)
    return upload


def update_upload(db: Session, upload: Upload, data: UploadUpdate) -> Upload:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(upload, field, value)
    db.commit()
    db.refresh(upload)
    return upload


def delete_upload(db: Session, upload: Upload) -> None:
    db.delete(upload)
    db.commit()
