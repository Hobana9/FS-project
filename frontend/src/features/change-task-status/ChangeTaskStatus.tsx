import { useState } from 'react';
import { Select } from '@mantine/core';
import {
  taskStatusOptions,
  useRepairTasks,
} from '../../entities/repair-task/index.ts';
import type { RepairTask, TaskStatus } from '../../entities/repair-task/index.ts';

type ChangeTaskStatusProps = {
  task: RepairTask;
  onChanged?: (status: TaskStatus) => void;
};

function ChangeTaskStatus({ task, onChanged }: ChangeTaskStatusProps) {
  const { changeTaskStatus } = useRepairTasks();
  const [error, setError] = useState<string | null>(null);

  function handleChange(status: TaskStatus | null) {
    if (status === null || status === task.status) {
      return;
    }

    setError(null);

    try {
      changeTaskStatus(task.id, status);
    } catch {
      setError('Не удалось изменить статус. Попробуйте ещё раз.');
      return;
    }

    onChanged?.(status);
  }

  return (
    <Select<TaskStatus>
      label="Изменить статус"
      data={taskStatusOptions}
      value={task.status}
      onChange={handleChange}
      allowDeselect={false}
      error={error}
      mt="xs"
    />
  );
}

export default ChangeTaskStatus;