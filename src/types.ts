export type UploadStatus = 'processing' | 'processed' | 'failed';

export type DefectType = 'faded_line' | 'gap';

export type DefectSeverity = 'low' | 'medium' | 'high';

export type TaskStatus = 'new' | 'in_progress' | 'done';

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

export type Defect = {
  id: string;
  uploadId: string;
  type: DefectType;
  severity: DefectSeverity;
  wearPercent: number;
  lengthM: number;
};

export type RepairTask = {
  id: string;
  defectId: string;
  crew: string;
  dueDate: string;
  status: TaskStatus;
  comment?: string;
};
