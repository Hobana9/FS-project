import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { ChangeTaskStatus } from '../features/change-task-status/index.ts';
import { DataState, MetaBadge } from '../shared/ui/index.ts';
import { formatDate, useDemoList } from '../shared/lib/index.ts';
import {
  defectSeverityMeta,
  defectTypeMeta,
  findDefect,
  getDefectAddress,
} from '../entities/defect/index.ts';
import {
  taskStatusMeta,
  taskStatusOptions,
  useRepairTasks,
} from '../entities/repair-task/index.ts';
import type { RepairTask, TaskStatus } from '../entities/repair-task/index.ts';
import { useUploads } from '../entities/upload/index.ts';

type StatusFilter = TaskStatus | 'all';

function TasksPage() {
  const { uploads } = useUploads();
  const { repairTasks } = useRepairTasks();
  const { data: tasks, status, retry } = useDemoList(repairTasks);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const visibleTasks = tasks.filter(
    (task) => statusFilter === 'all' || task.status === statusFilter,
  );

  function resetFilter() {
    setStatusFilter('all');
  }

  function handleStatusChanged(task: RepairTask, nextStatus: TaskStatus) {
    const defect = findDefect(task.defectId);
    const address = defect
      ? getDefectAddress(defect, uploads)
      : 'Адрес не определён';

    setStatusMessage(
      `Исполнитель «${task.crew}», ${address}. Новый статус: «${taskStatusMeta[nextStatus].label}».`,
    );
  }

  const cards = visibleTasks.map((task) => {
    const defect = findDefect(task.defectId);

    return (
      <Card key={task.id} withBorder padding="lg">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={500}>{task.crew}</Text>
            <MetaBadge meta={taskStatusMeta[task.status]} />
          </Group>

          {defect ? (
            <>
              <Text size="sm">{getDefectAddress(defect, uploads)}</Text>
              <Group gap="xs">
                <MetaBadge meta={defectTypeMeta[defect.type]} />
                <MetaBadge meta={defectSeverityMeta[defect.severity]} />
                <Text size="sm" c="dimmed">
                  {defect.lengthM} м
                </Text>
              </Group>
            </>
          ) : (
            <Text size="sm" c="dimmed">
              Дефект не найден
            </Text>
          )}

          <Text size="sm" c="dimmed">
            Срок: {formatDate(task.dueDate)}
          </Text>

          {task.comment && <Text size="sm">{task.comment}</Text>}

          <ChangeTaskStatus
            task={task}
            onChanged={(nextStatus) => handleStatusChanged(task, nextStatus)}
          />
        </Stack>
      </Card>
    );
  });

  return (
    <Stack gap="md">
      <Title order={2}>Задания на ремонт</Title>

      {statusMessage && (
        <Alert
          color="teal"
          title="Статус обновлён"
          role="status"
          withCloseButton
          closeButtonLabel="Закрыть уведомление"
          onClose={() => setStatusMessage(null)}
        >
          {statusMessage}
        </Alert>
      )}

      <Group align="flex-end" gap="sm">
        <Select<StatusFilter>
          label="Статус задания"
          w={220}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value ?? 'all')}
          allowDeselect={false}
          disabled={status !== 'ready'}
          data={[
            { value: 'all', label: 'Все статусы' },
            ...taskStatusOptions,
          ]}
        />
        <Button
          variant="default"
          disabled={status !== 'ready' || statusFilter === 'all'}
          onClick={resetFilter}
        >
          Сбросить фильтр
        </Button>
        {status === 'ready' && (
          <Text size="sm" c="dimmed" pb={8}>
            Показано: {visibleTasks.length} из {tasks.length}
          </Text>
        )}
      </Group>

      <DataState
        status={status}
        isEmpty={visibleTasks.length === 0}
        emptyMessage={
          tasks.length === 0
            ? 'Заданий пока нет. Создайте задание по одному из дефектов.'
            : 'Нет заданий с выбранным статусом.'
        }
        emptyAction={
          tasks.length === 0 ? (
            <Button component={Link} to="/defects" variant="light">
              Перейти к дефектам
            </Button>
          ) : (
            <Button variant="light" onClick={resetFilter}>
              Сбросить фильтр
            </Button>
          )
        }
        onRetry={retry}
      >
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {cards}
        </SimpleGrid>
      </DataState>
    </Stack>
  );
}

export default TasksPage;