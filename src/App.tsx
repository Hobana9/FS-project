import { Card, Stack, Text, Title } from '@mantine/core';
import AppLayout from './components/AppLayout.tsx';

function App() {
  return (
    <AppLayout>
      <Stack gap="md">
        <Title order={2}>Загрузки</Title>
        <Card withBorder padding="lg">
          <Text c="dimmed">
            Заглушка
          </Text>
        </Card>
      </Stack>
    </AppLayout>
  );
}

export default App;
