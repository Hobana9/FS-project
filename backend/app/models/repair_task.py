from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import TaskStatus

if TYPE_CHECKING:
    from app.models.defect import Defect


class RepairTask(Base):
    """Задание на восстановление разметки по конкретному дефекту."""

    __tablename__ = 'repair_tasks'

    id: Mapped[int] = mapped_column(primary_key=True)
    defect_id: Mapped[int] = mapped_column(
        ForeignKey('defects.id', ondelete='CASCADE'),
        unique=True,
    )
    crew: Mapped[str] = mapped_column(String(100))
    due_date: Mapped[date] = mapped_column(Date)
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, name='task_status'),
        default=TaskStatus.new,
    )
    comment: Mapped[str | None] = mapped_column(Text, default=None)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    defect: Mapped['Defect'] = relationship(back_populates='task')
