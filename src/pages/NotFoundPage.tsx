import { Button, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Stack gap="md" align="flex-start">
      <Title order={2}>Страница не найдена</Title>
      <Text c="dimmed">Такого раздела нет. Проверьте адрес или вернитесь к списку загрузок.</Text>
      <Button component={Link} to="/uploads">
        К загрузкам
      </Button>
    </Stack>
  );
}

export default NotFoundPage;
