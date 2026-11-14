import type { Meta } from '../../shared/lib/index.ts';

export type UploadStatus = 'processing' | 'processed' | 'failed';

/** Загруженный снимок участка улицы */
export type Upload = {
  id: string;
  street: string;
  section: string;
  capturedAt: string;
  uploadedBy: string;
  status: UploadStatus;
  photoUrl: string;
  defectCount: number;
};

export const uploadStatusMeta: Record<UploadStatus, Meta> = {
  processing: { label: 'В обработке', color: 'blue' },
  processed: { label: 'Обработан', color: 'teal' },
  failed: { label: 'Ошибка обработки', color: 'red' },
};
