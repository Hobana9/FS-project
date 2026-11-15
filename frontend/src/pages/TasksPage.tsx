import { Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { MetaBadge } from '../shared/ui/index.ts';
import { formatDate } from '../shared/lib/index.ts';
import { defectSeverityMeta, defectTypeMeta, findDefect, getDefectAddress } from '../entities/defect/index.ts';
import { taskStatusMeta, useRepairTasks } from '../entities/repair-task/index.ts';
import { useUploads } from '../entities/upload/index.ts';

function TasksPage() {
  const { uploads } = useUploads();
  const { repairTasks } = useRepairTasks();

  const cards = repairTasks.map((task) => {
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
        </Stack>
      </Card>
    );
  });

  return (
    <Stack gap="md">
      <Title order={2}>Задания на ремонт</Title>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {cards}
      </SimpleGrid>
    </Stack>
  );
}

export default TasksPage;