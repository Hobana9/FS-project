import { Button, Group, Image, Stack, Table, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import MetaBadge from '../components/MetaBadge.tsx';
import { uploadStatusMeta } from '../data/labels.ts';
import { uploads } from '../data/mockData.ts';
import { formatDate } from '../utils/format.ts';

function UploadsPage() {
  const rows = uploads.map((upload) => (
    <Table.Tr key={upload.id}>
      <Table.Td>
        <Image src={upload.photoUrl} alt="" w={96} h={60} fit="cover" radius="sm" />
      </Table.Td>
      <Table.Td>
        <Text fw={500}>{upload.street}</Text>
        <Text size="sm" c="dimmed">
          {upload.section}
        </Text>
      </Table.Td>
      <Table.Td>{formatDate(upload.capturedAt)}</Table.Td>
      <Table.Td>{upload.uploadedBy}</Table.Td>
      <Table.Td>
        <MetaBadge meta={uploadStatusMeta[upload.status]} />
      </Table.Td>
      <Table.Td>{upload.status === 'processed' ? upload.defectCount : '—'}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={2}>Загрузки</Title>
        <Button component={Link} to="/uploads/new">
          Загрузить снимок
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={760}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Снимок</Table.Th>
              <Table.Th>Участок</Table.Th>
              <Table.Th>Дата съёмки</Table.Th>
              <Table.Th>Инспектор</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th>Дефектов</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
}

export default UploadsPage;
