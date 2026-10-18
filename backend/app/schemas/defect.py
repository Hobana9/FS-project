from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import DefectSeverity, DefectType


class DefectBase(BaseModel):
    """Характеристики дефекта разметки."""

    type: DefectType = Field(description='Тип дефекта')
    severity: DefectSeverity = Field(description='Серьёзность')
    wear_percent: int = Field(ge=0, le=100, description='Степень износа, проценты')
    length_m: float = Field(gt=0, le=10_000, description='Протяжённость дефекта, метры')


class DefectCreate(DefectBase):
    """Тело запроса на добавление дефекта к снимку."""


class DefectUpdate(BaseModel):
    """Тело запроса на изменение дефекта."""

    type: DefectType | None = None
    severity: DefectSeverity | None = None
    wear_percent: int | None = Field(default=None, ge=0, le=100)
    length_m: float | None = Field(default=None, gt=0, le=10_000)


class DefectRead(BaseModel):
    """Дефект в ответе API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    upload_id: int
    type: DefectType
    severity: DefectSeverity
    wear_percent: int
    length_m: float
    address: str
    task_id: int | None
    task_crew: str | None
