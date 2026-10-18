"""Общий интерфейс анализаторов снимков.

Любая реализация — заглушка, классическое зрение, нейросеть — получает путь
к файлу и возвращает список найденных дефектов. Всё остальное приложение
знает только про этот контракт.
"""

from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

from app.models.enums import DefectSeverity, DefectType


@dataclass(frozen=True)
class DetectedDefect:
    """Один дефект, найденный на снимке."""

    type: DefectType
    severity: DefectSeverity
    wear_percent: int
    length_m: float


class AnalyzerError(RuntimeError):
    """Анализ не удалось выполнить: нет файла, битый формат, сбой модели."""


class MarkingAnalyzer(Protocol):
    """Контракт анализатора разметки."""

    name: str

    def analyze(self, image_path: Path) -> list[DetectedDefect]:
        """Находит дефекты разметки на снимке."""
        ...


def severity_from_wear(wear_percent: int) -> DefectSeverity:
    """Единое правило перевода износа в серьёзность — одинаковое для всех анализаторов."""
    if wear_percent < 40:
        return DefectSeverity.low
    if wear_percent < 70:
        return DefectSeverity.medium
    return DefectSeverity.high
