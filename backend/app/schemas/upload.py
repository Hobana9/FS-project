from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import UploadStatus


class UploadBase(BaseModel):
    """Поля, которые заполняет инспектор при загрузке снимка."""

    street: str = Field(min_length=1, max_length=200, description='Улица')
    section: str = Field(min_length=1, max_length=200, description='Участок или ориентир')
    captured_at: date = Field(description='Дата съёмки')
    uploaded_by: str = Field(min_length=1, max_length=200, description='Кто загрузил снимок')

    @field_validator('captured_at')
    @classmethod
    def captured_at_not_in_future(cls, value: date) -> date:
        if value > date.today():
            raise ValueError('Дата съёмки не может быть в будущем')
        return value


class UploadCreate(UploadBase):
    """Тело запроса на создание снимка."""

    photo_url: str = Field(min_length=1, max_length=500, description='Ссылка на фотографию')


class UploadUpdate(BaseModel):
    """Тело запроса на изменение. Передаются только те поля, которые нужно поменять."""

    street: str | None = Field(default=None, min_length=1, max_length=200)
    section: str | None = Field(default=None, min_length=1, max_length=200)
    captured_at: date | None = None
    uploaded_by: str | None = Field(default=None, min_length=1, max_length=200)
    status: UploadStatus | None = None

    @field_validator('captured_at')
    @classmethod
    def captured_at_not_in_future(cls, value: date | None) -> date | None:
        if value is not None and value > date.today():
            raise ValueError('Дата съёмки не может быть в будущем')
        return value


class UploadRead(BaseModel):
    """Снимок в ответе API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    street: str
    section: str
    captured_at: date
    uploaded_by: str
    photo_url: str
    status: UploadStatus
    defect_count: int
    created_at: datetime
