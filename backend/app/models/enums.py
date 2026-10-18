import enum


class UploadStatus(str, enum.Enum):
    """Стадия обработки загруженного снимка."""

    processing = 'processing'
    processed = 'processed'
    failed = 'failed'


class DefectType(str, enum.Enum):
    """Тип дефекта разметки."""

    faded_line = 'faded_line'
    gap = 'gap'


class DefectSeverity(str, enum.Enum):
    """Серьёзность дефекта."""

    low = 'low'
    medium = 'medium'
    high = 'high'


class TaskStatus(str, enum.Enum):
    """Состояние задания на ремонт."""

    new = 'new'
    in_progress = 'in_progress'
    done = 'done'
