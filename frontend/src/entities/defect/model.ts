import type { Meta } from '../../shared/lib/index.ts';

export type DefectType = 'faded_line' | 'gap';

export type DefectSeverity = 'low' | 'medium' | 'high';

/** Дефект разметки, найденный на снимке */
export type Defect = {
  id: string;
  uploadId: string;
  type: DefectType;
  severity: DefectSeverity;
  wearPercent: number;
  lengthM: number;
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
