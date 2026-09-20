import { Card, Stack, Text, Title } from '@mantine/core';

function DefectsPage() {
  return (
    <Stack gap="md">
      <Title order={2}>Дефекты</Title>
      <Card withBorder padding="lg">
        <Text c="dimmed">
          Реестр дефектов разметки с фильтрами по типу (стёртая линия, пробел) и серьёзности.
        </Text>
      </Card>
    </Stack>
  );
}

export default DefectsPage;
