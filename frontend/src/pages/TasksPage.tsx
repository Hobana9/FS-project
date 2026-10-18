import { Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import MetaBadge from '../components/MetaBadge.tsx';
import { defectSeverityMeta, defectTypeMeta, taskStatusMeta } from '../data/labels.ts';
import { findDefect, getDefectAddress, repairTasks } from '../data/mockData.ts';
import { formatDate } from '../utils/format.ts';

function TasksPage() {
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
              <Text size="sm">{getDefectAddress(defect)}</Text>
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
