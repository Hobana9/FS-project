import { useState } from 'react';
import {
  Alert,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { CreateRepairTaskForm } from '../features/create-repair-task/index.ts';
import { DataState, MetaBadge } from '../shared/ui/index.ts';
import { useDemoList } from '../shared/lib/index.ts';
import {
  defects,
  defectSeverityMeta,
  defectTypeMeta,
  getDefectAddress,
} from '../entities/defect/index.ts';
import type { Defect, DefectSeverity, DefectType } from '../entities/defect/index.ts';
import { taskStatusMeta, useRepairTasks } from '../entities/repair-task/index.ts';
import { useUploads } from '../entities/upload/index.ts';

type TypeFilter = DefectType | 'all';
type SeverityFilter = DefectSeverity | 'all';

function DefectsPage() {
  const { uploads } = useUploads();
  const { repairTasks } = useRepairTasks();
  const { data, status, retry } = useDemoList(defects);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [createdMessage, setCreatedMessage] = useState<string | null>(null);

  const filtersActive = typeFilter !== 'all' || severityFilter !== 'all';

  const visibleDefects = data.filter((defect) => {
    const typeMatches = typeFilter === 'all' || defect.type === typeFilter;
    const severityMatches = severityFilter === 'all' || defect.severity === severityFilter;
    return typeMatches && severityMatches;
  });

  function resetFilters() {
    setTypeFilter('all');
    setSeverityFilter('all');
  }

  function openCreateTask(defect: Defect) {
    setCreatedMessage(null);
    setSelectedDefect(defect);
  }

  function closeCreateTask() {
    setSelectedDefect(null);
  }

  function handleTaskCreated(crew: string) {
    if (!selectedDefect) {
      return;
    }

    const address = getDefectAddress(selectedDefect, uploads);
    setCreatedMessage(`Участок «${address}». Исполнитель: ${crew}.`);
    closeCreateTask();
  }

  const rows = visibleDefects.map((defect) => {
    const task = repairTasks.find((item) => item.defectId === defect.id);

    return (
      <Table.Tr key={defect.id}>
        <Table.Td>{getDefectAddress(defect, uploads)}</Table.Td>
        <Table.Td>
          <MetaBadge meta={defectTypeMeta[defect.type]} />
        </Table.Td>
        <Table.Td>
          <MetaBadge meta={defectSeverityMeta[defect.severity]} />
        </Table.Td>
        <Table.Td>{defect.wearPercent}%</Table.Td>
        <Table.Td>{defect.lengthM} м</Table.Td>
        <Table.Td>
          {task ? (
            <Stack gap={4} align="flex-start">
              <Text size="sm">{task.crew}</Text>
              <MetaBadge meta={taskStatusMeta[task.status]} />
            </Stack>
          ) : (
            <Button
              size="xs"
              variant="light"
              onClick={() => openCreateTask(defect)}
            >
              Создать задание
            </Button>
          )}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <Stack gap="md">
        <Title order={2}>Дефекты</Title>

        {createdMessage && (
          <Alert
            color="teal"
            title="Задание создано"
            role="status"
            withCloseButton
            closeButtonLabel="Закрыть уведомление"
            onClose={() => setCreatedMessage(null)}
          >
            <Stack gap="xs">
              <Text size="sm">{createdMessage}</Text>
              <Group>
                <Button component={Link} to="/tasks" size="xs" variant="light">
                  К заданиям
                </Button>
              </Group>
            </Stack>
          </Alert>
        )}

        <Group align="flex-end" gap="sm">
          <Select<TypeFilter>
            label="Тип дефекта"
            w={220}
            value={typeFilter}
            onChange={(value) => setTypeFilter(value ?? 'all')}
            allowDeselect={false}
            disabled={status !== 'ready'}
            data={[
              { value: 'all', label: 'Все типы' },
              { value: 'faded_line', label: defectTypeMeta.faded_line.label },
              { value: 'gap', label: defectTypeMeta.gap.label },
            ]}
          />
          <Select<SeverityFilter>
            label="Серьёзность"
            w={180}
            value={severityFilter}
            onChange={(value) => setSeverityFilter(value ?? 'all')}
            allowDeselect={false}
            disabled={status !== 'ready'}
            data={[
              { value: 'all', label: 'Любая' },
              { value: 'high', label: defectSeverityMeta.high.label },
              { value: 'medium', label: defectSeverityMeta.medium.label },
              { value: 'low', label: defectSeverityMeta.low.label },
            ]}
          />
          <Button
            variant="default"
            disabled={status !== 'ready' || !filtersActive}
            onClick={resetFilters}
          >
            Сбросить фильтры
          </Button>
          {status === 'ready' && (
            <Text size="sm" c="dimmed" pb={8}>
              Найдено: {visibleDefects.length}
            </Text>
          )}
        </Group>

        <DataState
          status={status}
          isEmpty={visibleDefects.length === 0}
          emptyMessage={
            data.length === 0
              ? 'Дефектов пока нет. Они появятся после анализа снимков.'
              : 'Под выбранные условия не подходит ни один дефект.'
          }
          emptyAction={
            data.length === 0 ? (
              <Button component={Link} to="/uploads" variant="light">
                Перейти к снимкам
              </Button>
            ) : (
              <Button variant="light" onClick={resetFilters}>
                Сбросить фильтры
              </Button>
            )
          }
          onRetry={retry}
        >
          <Table.ScrollContainer minWidth={760}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Адрес</Table.Th>
                  <Table.Th>Тип</Table.Th>
                  <Table.Th>Серьёзность</Table.Th>
                  <Table.Th>Износ</Table.Th>
                  <Table.Th>Длина</Table.Th>
                  <Table.Th>Задание</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </DataState>
      </Stack>

      <Modal
        opened={selectedDefect !== null}
        onClose={closeCreateTask}
        title="Новое задание на ремонт"
        closeButtonProps={{ 'aria-label': 'Закрыть форму задания' }}
        transitionProps={{ transition: 'fade', duration: 160, exitDuration: 0 }}
        centered
      >
        {selectedDefect && (
          <CreateRepairTaskForm
            key={selectedDefect.id}
            defect={selectedDefect}
            onCreated={handleTaskCreated}
            onCancel={closeCreateTask}
          />
        )}
      </Modal>
    </>
  );
}

export default DefectsPage;