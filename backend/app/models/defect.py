from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, Enum, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import DefectSeverity, DefectType

if TYPE_CHECKING:
    from app.models.repair_task import RepairTask
    from app.models.upload import Upload


class Defect(Base):
    """Дефект разметки, найденный на снимке."""

    __tablename__ = 'defects'
    __table_args__ = (
        CheckConstraint('wear_percent BETWEEN 0 AND 100', name='ck_defects_wear_percent'),
        CheckConstraint('length_m > 0', name='ck_defects_length_m'),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    upload_id: Mapped[int] = mapped_column(
        ForeignKey('uploads.id', ondelete='CASCADE'),
        index=True,
    )
    type: Mapped[DefectType] = mapped_column(Enum(DefectType, name='defect_type'))
    severity: Mapped[DefectSeverity] = mapped_column(Enum(DefectSeverity, name='defect_severity'))
    wear_percent: Mapped[int]
    length_m: Mapped[float] = mapped_column(Float)

    upload: Mapped['Upload'] = relationship(back_populates='defects')
    task: Mapped['RepairTask | None'] = relationship(
        back_populates='defect',
        cascade='all, delete-orphan',
    )
