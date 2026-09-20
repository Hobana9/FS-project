import { useState } from 'react';
import { Card, Group, Select, Stack, Table, Text, Title } from '@mantine/core';
import MetaBadge from '../components/MetaBadge.tsx';
import { defectSeverityMeta, defectTypeMeta } from '../data/labels.ts';
import { defects, findTaskByDefect, getDefectAddress } from '../data/mockData.ts';
import type { DefectSeverity, DefectType } from '../types.ts';

type TypeFilter = DefectType | 'all';
type SeverityFilter = DefectSeverity | 'all';

function DefectsPage() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');

  const visibleDefects = defects.filter((defect) => {
    const typeMatches = typeFilter === 'all' || defect.type === typeFilter;
    const severityMatches = severityFilter === 'all' || defect.severity === severityFilter;
    return typeMatches && severityMatches;
  });

  const rows = visibleDefects.map((defect) => {
    const task = findTaskByDefect(defect.id);

    return (
      <Table.Tr key={defect.id}>
        <Table.Td>{getDefectAddress(defect)}</Table.Td>
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
            task.crew
          ) : (
            <Text size="sm" c="dimmed">
              не назначено
            </Text>
          )}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Stack gap="md">
      <Title order={2}>Дефекты</Title>

      <Group align="flex-end" gap="sm">
        <Select
          label="Тип дефекта"
          w={220}
          value={typeFilter}
          onChange={(value) => setTypeFilter((value ?? 'all') as TypeFilter)}
          data={[
            { value: 'all', label: 'Все типы' },
            { value: 'faded_line', label: defectTypeMeta.faded_line.label },
            { value: 'gap', label: defectTypeMeta.gap.label },
          ]}
        />
        <Select
          label="Серьёзность"
          w={180}
          value={severityFilter}
          onChange={(value) => setSeverityFilter((value ?? 'all') as SeverityFilter)}
          data={[
            { value: 'all', label: 'Любая' },
            { value: 'high', label: defectSeverityMeta.high.label },
            { value: 'medium', label: defectSeverityMeta.medium.label },
            { value: 'low', label: defectSeverityMeta.low.label },
          ]}
        />
        <Text size="sm" c="dimmed" pb={8}>
          Найдено: {visibleDefects.length}
        </Text>
      </Group>

      {visibleDefects.length === 0 ? (
        <Card withBorder padding="lg">
          <Text c="dimmed">Под выбранные условия не подходит ни один дефект.</Text>
        </Card>
      ) : (
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
      )}
    </Stack>
  );
}

export default DefectsPage;
