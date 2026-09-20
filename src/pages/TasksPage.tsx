import { Card, Stack, Text, Title } from '@mantine/core';

function TasksPage() {
  return (
    <Stack gap="md">
      <Title order={2}>Задания на ремонт</Title>
      <Card withBorder padding="lg">
        <Text c="dimmed">
          Задания на восстановление разметки: адрес, исполнитель, срок выполнения и статус.
        </Text>
      </Card>
    </Stack>
  );
}

export default TasksPage;
