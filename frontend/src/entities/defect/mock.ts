import type { Upload } from '../upload/index.ts';
import type { Defect } from './model.ts';

export const defects: Defect[] = [
  { id: 'd-201', uploadId: 'u-101', type: 'faded_line', severity: 'high', wearPercent: 78, lengthM: 24 },
  { id: 'd-202', uploadId: 'u-101', type: 'gap', severity: 'medium', wearPercent: 45, lengthM: 6 },
  { id: 'd-203', uploadId: 'u-102', type: 'gap', severity: 'high', wearPercent: 91, lengthM: 4 },
  { id: 'd-204', uploadId: 'u-102', type: 'faded_line', severity: 'low', wearPercent: 22, lengthM: 11 },
];

export function findDefect(defectId: string): Defect | undefined {
  return defects.find((defect) => defect.id === defectId);
}

/** Адрес дефекта берётся из актуального списка снимков. */
export function getDefectAddress(
  defect: Defect,
  uploads: readonly Upload[],
): string {
  const upload = uploads.find((item) => item.id === defect.uploadId);

  if (!upload) {
    return 'Адрес не определён';
  }

  return `${upload.street}, ${upload.section}`;
}