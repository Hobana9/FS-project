import { Card, Stack, Text, Title } from '@mantine/core';

function NewUploadPage() {
  return (
    <Stack gap="md">
      <Title order={2}>Новая загрузка</Title>
      <Card withBorder padding="lg">
        <Text c="dimmed">
          Форма добавления снимка: фотография участка, улица, номер участка и дата съёмки.
        </Text>
      </Card>
    </Stack>
  );
}

export default NewUploadPage;
