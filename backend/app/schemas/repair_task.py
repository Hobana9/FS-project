from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import TaskStatus
from app.schemas.defect import DefectRead


class RepairTaskBase(BaseModel):
    """Поля задания на ремонт."""

    crew: str = Field(min_length=1, max_length=100, description='Исполнитель работ')
    due_date: date = Field(description='Срок выполнения')
    comment: str | None = Field(default=None, max_length=1000, description='Комментарий')


class RepairTaskCreate(RepairTaskBase):
    """Тело запроса на создание задания."""

    defect_id: int = Field(ge=1, description='Дефект, по которому создаётся задание')


class RepairTaskUpdate(BaseModel):
    """Тело запроса на изменение задания."""

    crew: str | None = Field(default=None, min_length=1, max_length=100)
    due_date: date | None = None
    status: TaskStatus | None = None
    comment: str | None = Field(default=None, max_length=1000)


class RepairTaskRead(BaseModel):
    """Задание в ответе API вместе с дефектом, к которому оно относится."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    defect_id: int
    crew: str
    due_date: date
    status: TaskStatus
    comment: str | None
    created_at: datetime
    defect: DefectRead
