import type { Defect, RepairTask, Upload } from '../types.ts';

export const uploads: Upload[] = [
  {
    id: 'u-101',
    street: 'проспект Ленина',
    section: 'д. 42 — д. 56',
    capturedAt: '2026-09-14',
    uploadedBy: 'Соколов А. В.',
    status: 'processed',
    photoUrl: '/photos/section-1.jpg',
    defectCount: 2,
  },
  {
    id: 'u-102',
    street: 'улица Гагарина',
    section: 'перекрёсток с ул. Мира',
    capturedAt: '2026-09-16',
    uploadedBy: 'Терехова М. И.',
    status: 'processed',
    photoUrl: '/photos/section-2.jpg',
    defectCount: 2,
  },
  {
    id: 'u-103',
    street: 'Северное шоссе',
    section: '3-й км',
    capturedAt: '2026-09-18',
    uploadedBy: 'Соколов А. В.',
    status: 'processing',
    photoUrl: '/photos/section-3.jpg',
    defectCount: 0,
  },
];

export const defects: Defect[] = [
  {
    id: 'd-201',
    uploadId: 'u-101',
    type: 'faded_line',
    severity: 'high',
    wearPercent: 78,
    lengthM: 24,
  },
  {
    id: 'd-202',
    uploadId: 'u-101',
    type: 'gap',
    severity: 'medium',
    wearPercent: 45,
    lengthM: 6,
  },
  {
    id: 'd-203',
    uploadId: 'u-102',
    type: 'gap',
    severity: 'high',
    wearPercent: 91,
    lengthM: 4,
  },
  {
    id: 'd-204',
    uploadId: 'u-102',
    type: 'faded_line',
    severity: 'low',
    wearPercent: 22,
    lengthM: 11,
  },
];

export const repairTasks: RepairTask[] = [
  {
    id: 't-301',
    defectId: 'd-201',
    crew: 'Бригада №1',
    dueDate: '2026-09-25',
    status: 'in_progress',
    comment: 'Нанести осевую линию заново на всём отрезке',
  },
  {
    id: 't-302',
    defectId: 'd-203',
    crew: 'Бригада №3',
    dueDate: '2026-09-22',
    status: 'new',
  },
  {
    id: 't-303',
    defectId: 'd-202',
    crew: 'Бригада №1',
    dueDate: '2026-09-19',
    status: 'done',
    comment: 'Работы приняты инспектором',
  },
];

export function findUpload(uploadId: string): Upload | undefined {
  return uploads.find((upload) => upload.id === uploadId);
}

export function findDefect(defectId: string): Defect | undefined {
  return defects.find((defect) => defect.id === defectId);
}

export function findTaskByDefect(defectId: string): RepairTask | undefined {
  return repairTasks.find((task) => task.defectId === defectId);
}

/** Адрес дефекта берётся у снимка, на котором он найден */
export function getDefectAddress(defect: Defect): string {
  const upload = findUpload(defect.uploadId);

  if (!upload) {
    return 'Адрес не определён';
  }

  return `${upload.street}, ${upload.section}`;
}
