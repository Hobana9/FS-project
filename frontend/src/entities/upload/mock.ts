import type { Upload } from './model.ts';

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

export function findUpload(uploadId: string): Upload | undefined {
  return uploads.find((upload) => upload.id === uploadId);
}
