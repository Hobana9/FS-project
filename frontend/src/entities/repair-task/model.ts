import type { Meta } from '../../shared/lib/index.ts';

const taskStatuses = ['new', 'in_progress', 'done'] as const;

export type TaskStatus = (typeof taskStatuses)[number];

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

export const taskStatusOptions = taskStatuses.map((status) => ({
  value: status,
  label: taskStatusMeta[status].label,
}));