import type { ReactNode } from 'react';
import { Alert, Button, Card, Group, Loader, Stack, Text } from '@mantine/core';
import type { LoadStatus } from '../lib/index.ts';
import classes from './DataState.module.css';

type DataStateProps = {
  status: LoadStatus;
  isEmpty: boolean;
  emptyMessage: string;
  emptyAction?: ReactNode;
  onRetry: () => void;
  children: ReactNode;
};

function DataState({
  status,
  isEmpty,
  emptyMessage,
  emptyAction,
  onRetry,
  children,
}: DataStateProps) {
  if (status === 'loading') {
    return (
      <Group
        justify="center"
        py="xl"
        role="status"
        aria-live="polite"
        className={classes.appear}
      >
        <Loader size="sm" aria-hidden="true" />
        <Text c="dimmed">Загружаем данные…</Text>
      </Group>
    );
  }

  if (status === 'error') {
    return (
      <Alert
        color="red"
        title="Ошибка загрузки"
        role="alert"
        className={classes.appear}
      >
        <Stack gap="sm">
          <Text size="sm">
            Не удалось загрузить данные. Попробуйте ещё раз.
          </Text>
          <Group>
            <Button color="red" variant="light" onClick={onRetry}>
              Повторить
            </Button>
          </Group>
        </Stack>
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <Card
        withBorder
        padding="lg"
        role="status"
        className={classes.appear}
      >
        <Stack gap="sm">
          <Text c="dimmed">{emptyMessage}</Text>
          {emptyAction && <Group>{emptyAction}</Group>}
        </Stack>
      </Card>
    );
  }

  return <div className={classes.appear}>{children}</div>;
}

export default DataState;