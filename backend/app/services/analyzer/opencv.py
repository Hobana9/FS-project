"""Анализатор разметки на основе классического компьютерного зрения.

Порядок обработки:

1. Снимок переводится в градации серого и уменьшается до рабочего размера.
2. Морфологический top-hat выделяет яркие тонкие объекты на тёмном асфальте —
   то есть собственно краску, не реагируя на общую освещённость кадра.
3. Порог Оцу превращает результат в маску разметки.
4. Маска разбивается на горизонтальные полосы — отдельные линии разметки.
5. Каждая полоса делится на штрихи; по яркости штрихов считается износ,
   по длине промежутков между ними — пропуски в разметке.

Эталоном яркости служит самый светлый штрих на этом же снимке, поэтому
оценка не зависит от погоды и времени суток.
"""

import cv2
import numpy as np

from pathlib import Path

from app.core.config import settings
from app.models.enums import DefectType
from app.services.analyzer.base import AnalyzerError, DetectedDefect, severity_from_wear

# Штрих считается стёртым, если он темнее этой доли от эталонной яркости.
FADED_RATIO = 0.80

# Промежуток считается пропуском, если он длиннее типичного во столько раз.
GAP_FACTOR = 2.5

# Наибольшая сторона снимка при обработке.
WORK_SIZE = 1024

# Размер окна top-hat: заведомо больше толщины линии разметки.
TOPHAT_KERNEL = 31

MIN_SEGMENT_PX = 5


def _load_gray(image_path: Path) -> np.ndarray:
    if not image_path.is_file():
        raise AnalyzerError(f'Файл снимка не найден: {image_path}')

    image = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)
    if image is None:
        raise AnalyzerError(f'Не удалось прочитать изображение: {image_path.name}')

    height, width = image.shape
    longest = max(height, width)
    if longest > WORK_SIZE:
        scale = WORK_SIZE / longest
        image = cv2.resize(image, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)

    return image


def _marking_mask(image: np.ndarray) -> np.ndarray:
    """Маска краски: яркие тонкие структуры на тёмном фоне."""
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (TOPHAT_KERNEL, TOPHAT_KERNEL))
    tophat = cv2.morphologyEx(image, cv2.MORPH_TOPHAT, kernel)
    _, mask = cv2.threshold(tophat, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    # Склеиваем разрывы внутри одного штриха, не трогая промежутки между штрихами.
    return cv2.morphologyEx(mask, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_RECT, (9, 3)))


def _runs(flags: np.ndarray) -> list[tuple[int, int]]:
    """Непрерывные участки, где flags истинно, как пары (начало, конец)."""
    result: list[tuple[int, int]] = []
    start: int | None = None
    for index, value in enumerate(flags):
        if value and start is None:
            start = index
        elif not value and start is not None:
            result.append((start, index))
            start = None
    if start is not None:
        result.append((start, len(flags)))
    return result


def _line_bands(mask: np.ndarray) -> list[tuple[int, int]]:
    """Горизонтальные полосы, в которых есть краска, — отдельные линии разметки."""
    painted_per_row = mask.sum(axis=1) / 255.0
    threshold = max(5.0, float(painted_per_row.max()) * 0.15)
    return [(y0, y1) for y0, y1 in _runs(painted_per_row > threshold) if y1 - y0 >= 3]


class OpenCvAnalyzer:
    """Ищет стёртые линии и пропуски разметки методами обработки изображений."""

    name = 'opencv'

    def analyze(self, image_path: Path) -> list[DetectedDefect]:
        image = _load_gray(image_path)
        height, width = image.shape
        mask = _marking_mask(image)

        lines = []
        for y0, y1 in _line_bands(mask):
            band_mask = mask[y0:y1, :]
            band_image = image[y0:y1, :]

            painted_columns = band_mask.sum(axis=0) > 0
            if int(painted_columns.sum()) < width * 0.05:
                continue

            segments = [(a, b) for a, b in _runs(painted_columns) if b - a >= MIN_SEGMENT_PX]
            if not segments:
                continue

            brightness = []
            for a, b in segments:
                pixels = band_image[:, a:b][band_mask[:, a:b] > 0]
                brightness.append(float(pixels.mean()) if pixels.size else 0.0)

            lines.append((segments, brightness))

        if not lines:
            return []

        # Эталон — самый светлый штрих на этом снимке.
        reference = max(max(brightness) for _, brightness in lines)
        if reference <= 0:
            return []

        defects: list[DetectedDefect] = []
        for segments, brightness in lines:
            defects.extend(self._faded_defect(segments, brightness, reference))
            defects.extend(self._gap_defects(segments, width))

        return defects

    def _faded_defect(
        self,
        segments: list[tuple[int, int]],
        brightness: list[float],
        reference: float,
    ) -> list[DetectedDefect]:
        faded = [
            (segment, value)
            for segment, value in zip(segments, brightness)
            if value < reference * FADED_RATIO
        ]
        if not faded:
            return []

        wear_percent = int(round(float(np.mean([100 * (1 - v / reference) for _, v in faded]))))
        wear_percent = max(1, min(100, wear_percent))
        length_px = sum(b - a for (a, b), _ in faded)

        return [
            DetectedDefect(
                type=DefectType.faded_line,
                severity=severity_from_wear(wear_percent),
                wear_percent=wear_percent,
                length_m=self._to_meters(length_px),
            )
        ]

    def _gap_defects(self, segments: list[tuple[int, int]], width: int) -> list[DetectedDefect]:
        if len(segments) < 2:
            return []

        gaps = [(segments[i][1], segments[i + 1][0]) for i in range(len(segments) - 1)]
        lengths = [b - a for a, b in gaps]
        typical = float(np.median(lengths))
        if typical <= 0:
            return []

        defects = []
        for a, b in gaps:
            length_px = b - a
            if length_px <= typical * GAP_FACTOR or length_px <= width * 0.05:
                continue
            # Нормальным считается промежуток длиной typical, всё сверх него —
            # отсутствующая краска. Её доля и есть степень дефекта.
            wear_percent = max(1, min(100, int(round(100 * (1 - typical / length_px)))))
            defects.append(
                DetectedDefect(
                    type=DefectType.gap,
                    severity=severity_from_wear(wear_percent),
                    wear_percent=wear_percent,
                    length_m=self._to_meters(length_px),
                )
            )
        return defects

    @staticmethod
    def _to_meters(length_px: int) -> float:
        return max(0.1, round(length_px / settings.pixels_per_meter, 1))
