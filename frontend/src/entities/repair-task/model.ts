import type { Meta } from '../../shared/lib/index.ts';

export type TaskStatus = 'new' | 'in_progress' | 'done';

/** Задание на восстановление разметки по конкретному дефекту */
export type RepairTask = {
  id: string;
  defectId: string;
  crew: string;
  dueDate: string;
  status: TaskStatus;
  comment?: string;
};

export const taskStatusMeta: Record<TaskStatus, Meta> = {
  new: { label: 'Новое', color: 'blue' },
  in_progress: { label: 'Выполняется', color: 'indigo' },
  done: { label: 'Выполнено', color: 'teal' },
};
