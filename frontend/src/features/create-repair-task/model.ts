import { isValidDate } from '../../shared/lib/index.ts';

export const MAX_CREW_LENGTH = 100;
export const MAX_COMMENT_LENGTH = 1000;

export type RepairTaskFormValues = {
  crew: string;
  dueDate: string;
  comment: string;
};

export type RepairTaskFormErrors = Partial<
  Record<keyof RepairTaskFormValues, string>
>;

export function createEmptyRepairTaskForm(): RepairTaskFormValues {
  return {
    crew: '',
    dueDate: '',
    comment: '',
  };
}

export function validateRepairTaskForm(
  values: RepairTaskFormValues,
): RepairTaskFormErrors {
  const errors: RepairTaskFormErrors = {};
  const crew = values.crew.trim();

  if (!crew) {
    errors.crew = 'Укажите исполнителя';
  } else if (crew.length > MAX_CREW_LENGTH) {
    errors.crew = `Введите не более ${MAX_CREW_LENGTH} символов`;
  }

  if (!values.dueDate) {
    errors.dueDate = 'Укажите срок выполнения';
  } else if (!isValidDate(values.dueDate)) {
    errors.dueDate = 'Укажите корректную дату';
  }

  if (values.comment.trim().length > MAX_COMMENT_LENGTH) {
    errors.comment = `Введите не более ${MAX_COMMENT_LENGTH} символов`;
  }

  return errors;
}