import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Alert,
  Button,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import {
  defectSeverityMeta,
  defectTypeMeta,
  getDefectAddress,
} from '../../entities/defect/index.ts';
import type { Defect } from '../../entities/defect/index.ts';
import { useRepairTasks } from '../../entities/repair-task/index.ts';
import { useUploads } from '../../entities/upload/index.ts';
import { MetaBadge } from '../../shared/ui/index.ts';
import {
  createEmptyRepairTaskForm,
  MAX_COMMENT_LENGTH,
  MAX_CREW_LENGTH,
  validateRepairTaskForm,
} from './model.ts';
import type { RepairTaskFormErrors, RepairTaskFormValues } from './model.ts';

type CreateRepairTaskFormProps = {
  defect: Defect;
  onCreated: (crew: string) => void;
  onCancel: () => void;
};

function CreateRepairTaskForm({
  defect,
  onCreated,
  onCancel,
}: CreateRepairTaskFormProps) {
  const { uploads } = useUploads();
  const { repairTasks, addRepairTask } = useRepairTasks();
  const [values, setValues] = useState<RepairTaskFormValues>(
    createEmptyRepairTaskForm,
  );
  const [errors, setErrors] = useState<RepairTaskFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitLocked = useRef(false);

  const existingTask = repairTasks.find((task) => task.defectId === defect.id);

  function updateField<K extends keyof RepairTaskFormValues>(
    field: K,
    value: RepairTaskFormValues[K],
  ) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setSubmitError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitLocked.current) {
      return;
    }

    if (existingTask) {
      setSubmitError('По этому дефекту уже создано задание.');
      return;
    }

    const nextErrors = validateRepairTaskForm(values);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const crew = values.crew.trim();
    submitLocked.current = true;

    try {
      addRepairTask({
        defectId: defect.id,
        crew,
        dueDate: values.dueDate,
        comment: values.comment.trim() || undefined,
      });
    } catch {
      submitLocked.current = false;
      setSubmitError('Не удалось создать задание. Попробуйте ещё раз.');
      return;
    }

    onCreated(crew);
  }

  if (existingTask) {
    return (
      <Stack gap="md">
        <Alert color="yellow" title="Задание уже существует" role="alert">
          По этому дефекту уже назначен исполнитель: {existingTask.crew}.
        </Alert>
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel}>
            Закрыть
          </Button>
        </Group>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack gap="md">
        <Stack gap="xs">
          <Text fw={500}>{getDefectAddress(defect, uploads)}</Text>
          <Group gap="xs">
            <MetaBadge meta={defectTypeMeta[defect.type]} />
            <MetaBadge meta={defectSeverityMeta[defect.severity]} />
          </Group>
          <Text size="sm" c="dimmed">
            Износ: {defect.wearPercent}%. Длина: {defect.lengthM} м.
          </Text>
        </Stack>

        {submitError && (
          <Alert color="red" title="Ошибка создания задания" role="alert">
            {submitError}
          </Alert>
        )}

        <TextInput
          label="Исполнитель"
          description={`До ${MAX_CREW_LENGTH} символов`}
          placeholder="Бригада №2"
          value={values.crew}
          onChange={(event) => updateField('crew', event.currentTarget.value)}
          error={errors.crew}
          required
          data-autofocus
        />

        <TextInput
          label="Срок выполнения"
          type="date"
          value={values.dueDate}
          onChange={(event) => updateField('dueDate', event.currentTarget.value)}
          error={errors.dueDate}
          required
        />

        <Textarea
          label="Комментарий"
          description={`Необязательно, до ${MAX_COMMENT_LENGTH} символов`}
          placeholder="Что нужно выполнить на участке"
          value={values.comment}
          onChange={(event) => updateField('comment', event.currentTarget.value)}
          error={errors.comment}
          autosize
          minRows={3}
          maxRows={6}
        />

        <Group justify="flex-end">
          <Button type="button" variant="default" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">Создать задание</Button>
        </Group>
      </Stack>
    </form>
  );
}

export default CreateRepairTaskForm;