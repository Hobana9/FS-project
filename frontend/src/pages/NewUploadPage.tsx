import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Button, Card, FileInput, Group, Stack, TextInput, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

function NewUploadPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [street, setStreet] = useState('');
  const [section, setSection] = useState('');
  const [capturedAt, setCapturedAt] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <Stack gap="md">
      <Title order={2}>Новая загрузка</Title>

      {sent && (
        <Alert color="teal" title="Снимок принят">
          Участок «{street}» поставлен в очередь на обработку.
        </Alert>
      )}

      <Card withBorder padding="lg" maw={560}>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <FileInput
              label="Фотография участка"
              placeholder="Выберите файл"
              accept="image/jpeg,image/png"
              value={photo}
              onChange={setPhoto}
            />
            <TextInput
              label="Улица"
              placeholder="проспект Ленина"
              value={street}
              onChange={(event) => setStreet(event.currentTarget.value)}
            />
            <TextInput
              label="Участок"
              placeholder="д. 42 — д. 56"
              value={section}
              onChange={(event) => setSection(event.currentTarget.value)}
            />
            <TextInput
              label="Дата съёмки"
              type="date"
              value={capturedAt}
              onChange={(event) => setCapturedAt(event.currentTarget.value)}
            />

            <Group justify="flex-end" mt="xs">
              <Button component={Link} to="/uploads" variant="default">
                Отмена
              </Button>
              <Button type="submit">Отправить на обработку</Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}

export default NewUploadPage;
