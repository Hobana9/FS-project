from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

app = FastAPI(
    title='Контроль дорожной разметки',
    description='API системы контроля состояния дорожной разметки',
    version='0.1.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/api/health', tags=['Служебные'], summary='Проверка работоспособности')
def health() -> dict[str, str]:
    return {'status': 'ok'}
