import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { RepairTask, TaskStatus } from './model.ts';
import { initialRepairTasks } from './mock.ts';

export type CreateRepairTaskInput = Omit<RepairTask, 'id' | 'status'>;

type RepairTasksContextValue = {
  repairTasks: readonly RepairTask[];
  addRepairTask: (input: CreateRepairTaskInput) => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => void;
};

type RepairTasksProviderProps = {
  children: ReactNode;
};

const RepairTasksContext = createContext<RepairTasksContextValue | null>(null);

export function RepairTasksProvider({ children }: RepairTasksProviderProps) {
  const [repairTasks, setRepairTasks] = useState<RepairTask[]>(
    () => [...initialRepairTasks],
  );

  function addRepairTask(input: CreateRepairTaskInput) {
    const task: RepairTask = {
      ...input,
      id: `t-${crypto.randomUUID()}`,
      status: 'new',
    };

    setRepairTasks((currentTasks) => {
      const alreadyExists = currentTasks.some(
        (currentTask) => currentTask.defectId === input.defectId,
      );

      return alreadyExists ? currentTasks : [task, ...currentTasks];
    });
  }

  function changeTaskStatus(taskId: string, status: TaskStatus) {
    setRepairTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    );
  }

  return (
    <RepairTasksContext.Provider
      value={{ repairTasks, addRepairTask, changeTaskStatus }}
    >
      {children}
    </RepairTasksContext.Provider>
  );
}

export function useRepairTasks(): RepairTasksContextValue {
  const context = useContext(RepairTasksContext);

  if (context === null) {
    throw new Error(
      'useRepairTasks должен использоваться внутри RepairTasksProvider',
    );
  }

  return context;
}