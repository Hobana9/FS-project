import { Card, Stack, Text, Title } from '@mantine/core';

function UploadsPage() {
  return (
    <Stack gap="md">
      <Title order={2}>Загрузки</Title>
      <Card withBorder padding="lg">
        <Text c="dimmed">
          Список загруженных снимков участков улиц: адрес, дата съёмки, статус обработки и
          количество найденных дефектов.
        </Text>
      </Card>
    </Stack>
  );
}

export default UploadsPage;
