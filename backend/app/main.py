from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError

from app.api import defects, repair_tasks, uploads
from app.core.config import settings

app = FastAPI(
    title='Контроль дорожной разметки',
    description='API системы контроля состояния дорожной разметки',
    version='0.2.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(uploads.router)
app.include_router(defects.router)
app.include_router(repair_tasks.router)

# Раздача загруженных фотографий. Каталог создаётся заранее:
# StaticFiles требует существующий путь уже при подключении.
settings.media_root.mkdir(parents=True, exist_ok=True)
app.mount('/media', StaticFiles(directory=settings.media_root), name='media')


@app.exception_handler(ValidationError)
def validation_error_handler(request: Request, exc: ValidationError) -> JSONResponse:
    """Ошибки схем, которые мы проверяем вручную, отдаём в том же виде, что и остальные."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={'detail': jsonable_encoder(exc.errors())},
    )


@app.exception_handler(IntegrityError)
def integrity_error_handler(request: Request, exc: IntegrityError) -> JSONResponse:
    """Страховка на случай, если ограничение базы нарушено там, где мы этого не предусмотрели."""
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={'detail': 'Операция нарушает ограничения целостности данных'},
    )


@app.get('/api/health', tags=['Служебные'], summary='Проверка работоспособности')
def health() -> dict[str, str]:
    return {'status': 'ok'}
