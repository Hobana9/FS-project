import { Card, Stack, Text, Title } from '@mantine/core';
import { UploadPhotoForm } from '../features/upload-photo/index.ts';

function NewUploadPage() {
  return (
    <Stack gap="md">
      <Title order={2}>Новая загрузка</Title>

      <Text size="sm" c="dimmed" maw={560}>
        Демонстрационный режим: снимки сохраняются до перезагрузки страницы.
        Автоматический анализ пока не запускается.
      </Text>

      <Card withBorder padding="lg" maw={560}>
        <UploadPhotoForm />
      </Card>
    </Stack>
  );
}

export default NewUploadPage;