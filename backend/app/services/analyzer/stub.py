"""Анализатор-заглушка.

Настоящей модели не использует: выдаёт правдоподобный набор дефектов,
вычисленный по содержимому файла. Благодаря этому один и тот же снимок
всегда даёт один и тот же результат, что удобно и для демонстрации,
и для проверки остальной части приложения.
"""

import hashlib
import random
from pathlib import Path

from app.models.enums import DefectType
from app.services.analyzer.base import AnalyzerError, DetectedDefect, severity_from_wear


class StubAnalyzer:
    """Выдаёт заранее предсказуемый результат вместо распознавания."""

    name = 'stub'

    def analyze(self, image_path: Path) -> list[DetectedDefect]:
        if not image_path.is_file():
            raise AnalyzerError(f'Файл снимка не найден: {image_path}')

        content = image_path.read_bytes()
        if not content:
            raise AnalyzerError('Файл снимка пустой')

        # Зерно из содержимого файла: одинаковый снимок — одинаковый результат.
        seed = hashlib.sha256(content).digest()
        rng = random.Random(seed)

        defects: list[DetectedDefect] = []
        for _ in range(rng.choice([0, 1, 1, 2, 2, 3])):
            wear_percent = rng.randint(15, 95)
            defects.append(
                DetectedDefect(
                    type=rng.choice(list(DefectType)),
                    severity=severity_from_wear(wear_percent),
                    wear_percent=wear_percent,
                    length_m=round(rng.uniform(2.0, 40.0), 1),
                )
            )

        return defects
