import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Alert,
  Button,
  FileInput,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useUploads } from '../../entities/upload/index.ts';
import {
  createEmptyUploadForm,
  getLocalDate,
  MAX_PHOTO_SIZE_MB,
  PHOTO_ACCEPT,
  validateUploadForm,
} from './model.ts';
import type { UploadFormErrors, UploadFormValues } from './model.ts';
import { usePhotoPreview } from './usePhotoPreview.ts';

function UploadPhotoForm() {
  const { addUpload } = useUploads();
  const [values, setValues] = useState<UploadFormValues>(createEmptyUploadForm);
  const [errors, setErrors] = useState<UploadFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedStreet, setSavedStreet] = useState<string | null>(null);
  const submitLocked = useRef(false);
  const { photoUrl, error: photoError, isLoading } = usePhotoPreview(values.photo);

  function updateField<K extends keyof UploadFormValues>(
    field: K,
    value: UploadFormValues[K],
  ) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setSubmitError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitLocked.current || isLoading) {
      return;
    }

    const nextErrors = validateUploadForm(values);

    if (photoError) {
      nextErrors.photo = photoError;
    }

    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!photoUrl) {
      setErrors({ photo: 'Выберите фотографию повторно' });
      return;
    }

    submitLocked.current = true;

    try {
      addUpload({
        street: values.street.trim(),
        section: values.section.trim(),
        capturedAt: values.capturedAt,
        uploadedBy: values.uploadedBy.trim(),
        photoUrl,
      });

      setSavedStreet(values.street.trim());
    } catch {
      submitLocked.current = false;
      setSubmitError('Не удалось добавить снимок. Попробуйте ещё раз.');
    }
  }

  function resetForm() {
    setValues(createEmptyUploadForm());
    setErrors({});
    setSubmitError(null);
    setSavedStreet(null);
    submitLocked.current = false;
  }

  if (savedStreet !== null) {
    return (
      <Stack gap="md">
        <Alert color="teal" title="Снимок добавлен" role="status">
          Снимок участка «{savedStreet}» появился в списке загрузок.
        </Alert>

        <Group justify="flex-end">
          <Button variant="default" onClick={resetForm}>
            Загрузить ещё
          </Button>
          <Button component={Link} to="/uploads">
            К загрузкам
          </Button>
        </Group>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack gap="md">
        {submitError && (
          <Alert color="red" title="Ошибка сохранения" role="alert">
            {submitError}
          </Alert>
        )}

        <FileInput
          label="Фотография участка"
          description={`JPEG или PNG, до ${MAX_PHOTO_SIZE_MB} МБ`}
          placeholder="Выберите файл"
          accept={PHOTO_ACCEPT}
          value={values.photo}
          onChange={(photo) => updateField('photo', photo)}
          error={photoError ?? errors.photo}
          clearable
          clearButtonProps={{ 'aria-label': 'Убрать фотографию' }}
          required
        />

        {isLoading && (
          <Text size="sm" c="dimmed" role="status">
            Подготавливаем предпросмотр фотографии…
          </Text>
        )}

        {photoUrl && (
          <Image
            src={photoUrl}
            alt="Предпросмотр выбранного снимка участка"
            h={220}
            fit="contain"
            radius="sm"
          />
        )}

        <TextInput
          label="Улица"
          placeholder="проспект Ленина"
          value={values.street}
          onChange={(event) => updateField('street', event.currentTarget.value)}
          error={errors.street}
          required
        />

        <TextInput
          label="Участок"
          placeholder="д. 42 — д. 56"
          value={values.section}
          onChange={(event) => updateField('section', event.currentTarget.value)}
          error={errors.section}
          required
        />

        <TextInput
          label="Дата съёмки"
          type="date"
          max={getLocalDate()}
          value={values.capturedAt}
          onChange={(event) => updateField('capturedAt', event.currentTarget.value)}
          error={errors.capturedAt}
          required
        />

        <TextInput
          label="Инспектор"
          placeholder="Соколов А. В."
          value={values.uploadedBy}
          onChange={(event) => updateField('uploadedBy', event.currentTarget.value)}
          error={errors.uploadedBy}
          required
        />

        <Group justify="flex-end" mt="xs">
          <Button component={Link} to="/uploads" variant="default">
            Отмена
          </Button>
          <Button type="submit" loading={isLoading}>
            Добавить снимок
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default UploadPhotoForm;