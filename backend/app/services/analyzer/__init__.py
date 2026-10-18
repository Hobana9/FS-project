"""Выбор анализатора по настройкам приложения."""

from app.core.config import settings
from app.services.analyzer.base import (
    AnalyzerError,
    DetectedDefect,
    MarkingAnalyzer,
    severity_from_wear,
)
from app.services.analyzer.stub import StubAnalyzer

_ANALYZERS: dict[str, type] = {
    StubAnalyzer.name: StubAnalyzer,
}


def get_analyzer() -> MarkingAnalyzer:
    """Возвращает анализатор, указанный в настройке ANALYZER."""
    analyzer_class = _ANALYZERS.get(settings.analyzer)
    if analyzer_class is None:
        known = ', '.join(sorted(_ANALYZERS))
        raise AnalyzerError(f'Неизвестный анализатор {settings.analyzer!r}. Доступны: {known}')
    return analyzer_class()


__all__ = [
    'AnalyzerError',
    'DetectedDefect',
    'MarkingAnalyzer',
    'get_analyzer',
    'severity_from_wear',
]
