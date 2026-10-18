from fastapi import Depends, HTTPException, Path, status
from sqlalchemy.orm import Session

from app.crud import upload as upload_crud
from app.db.session import get_db
from app.models import Upload


def get_upload_or_404(
    upload_id: int = Path(ge=1, description='Идентификатор снимка'),
    db: Session = Depends(get_db),
) -> Upload:
    upload = upload_crud.get_upload(db, upload_id)
    if upload is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Снимок с id={upload_id} не найден',
        )
    return upload
