import type { RepairTask } from './model.ts';

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

export function findTaskByDefect(defectId: string): RepairTask | undefined {
  return repairTasks.find((task) => task.defectId === defectId);
}
