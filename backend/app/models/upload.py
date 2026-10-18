from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import UploadStatus

if TYPE_CHECKING:
    from app.models.defect import Defect


class Upload(Base):
    """Загруженный снимок участка улицы."""

    __tablename__ = 'uploads'

    id: Mapped[int] = mapped_column(primary_key=True)
    street: Mapped[str] = mapped_column(String(200))
    section: Mapped[str] = mapped_column(String(200))
    captured_at: Mapped[date] = mapped_column(Date)
    uploaded_by: Mapped[str] = mapped_column(String(200))
    photo_url: Mapped[str] = mapped_column(String(500))
    status: Mapped[UploadStatus] = mapped_column(
        Enum(UploadStatus, name='upload_status'),
        default=UploadStatus.processing,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    defects: Mapped[list['Defect']] = relationship(
        back_populates='upload',
        cascade='all, delete-orphan',
        order_by='Defect.id',
    )

    @property
    def defect_count(self) -> int:
        return len(self.defects)
