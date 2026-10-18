import type { DefectSeverity, DefectType, TaskStatus, UploadStatus } from '../types.ts';

export type Meta = {
  label: string;
  color: string;
};

export const uploadStatusMeta: Record<UploadStatus, Meta> = {
  processing: { label: 'В обработке', color: 'blue' },
  processed: { label: 'Обработан', color: 'teal' },
  failed: { label: 'Ошибка обработки', color: 'red' },
};

export const defectTypeMeta: Record<DefectType, Meta> = {
  faded_line: { label: 'Стёртая линия', color: 'orange' },
  gap: { label: 'Пробел в разметке', color: 'grape' },
};

export const defectSeverityMeta: Record<DefectSeverity, Meta> = {
  low: { label: 'Низкая', color: 'gray' },
  medium: { label: 'Средняя', color: 'yellow' },
  high: { label: 'Высокая', color: 'red' },
};

export const taskStatusMeta: Record<TaskStatus, Meta> = {
  new: { label: 'Новое', color: 'blue' },
  in_progress: { label: 'Выполняется', color: 'indigo' },
  done: { label: 'Выполнено', color: 'teal' },
};
