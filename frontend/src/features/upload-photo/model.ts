export const MAX_PHOTO_SIZE_MB = 5;

const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png'];

export const PHOTO_ACCEPT = ALLOWED_PHOTO_TYPES.join(',');

export type UploadFormValues = {
  photo: File | null;
  street: string;
  section: string;
  capturedAt: string;
  uploadedBy: string;
};

export type UploadFormErrors = Partial<Record<keyof UploadFormValues, string>>;

export function createEmptyUploadForm(): UploadFormValues {
  return {
    photo: null,
    street: '',
    section: '',
    capturedAt: '',
    uploadedBy: '',
  };
}

export function getLocalDate(date: Date = new Date()): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function validatePhoto(photo: File | null): string | undefined {
  if (!photo) {
    return 'Выберите фотографию участка';
  }

  if (!ALLOWED_PHOTO_TYPES.includes(photo.type)) {
    return 'Допустимы только изображения JPEG или PNG';
  }

  if (photo.size === 0) {
    return 'Выбранный файл пустой';
  }

  if (photo.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
    return `Размер файла не должен превышать ${MAX_PHOTO_SIZE_MB} МБ`;
  }

  return undefined;
}

function validateRequiredText(value: string, message: string): string | undefined {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return message;
  }

  if (trimmedValue.length > 200) {
    return 'Введите не более 200 символов';
  }

  return undefined;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);

  return !Number.isNaN(date.getTime()) && getLocalDate(date) === value;
}

export function validateUploadForm(values: UploadFormValues): UploadFormErrors {
  const errors: UploadFormErrors = {};

  const fieldErrors = {
    photo: validatePhoto(values.photo),
    street: validateRequiredText(values.street, 'Укажите улицу'),
    section: validateRequiredText(values.section, 'Укажите участок'),
    uploadedBy: validateRequiredText(values.uploadedBy, 'Укажите инспектора'),
  };

  for (const [field, message] of Object.entries(fieldErrors)) {
    if (message) {
      errors[field as keyof typeof fieldErrors] = message;
    }
  }

  if (!values.capturedAt) {
    errors.capturedAt = 'Укажите дату съёмки';
  } else if (!isValidDate(values.capturedAt)) {
    errors.capturedAt = 'Укажите корректную дату';
  } else if (values.capturedAt > getLocalDate()) {
    errors.capturedAt = 'Дата съёмки не может быть в будущем';
  }

  return errors;
}