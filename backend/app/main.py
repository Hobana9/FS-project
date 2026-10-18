from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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
