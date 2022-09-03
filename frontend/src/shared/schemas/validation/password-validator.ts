import * as yup from 'yup';

export const MIN_PSWRD_LENGTH = 6;
export const MAX_PWRD_LENGTH = 30;

export const passwordValidator = yup
  .string()
  .min(
    MIN_PSWRD_LENGTH,
    `Password must be at least ${MIN_PSWRD_LENGTH} characters`
  )
  .max(
    MAX_PWRD_LENGTH,
    `Password must be ${MAX_PWRD_LENGTH} characters or less`
  )
  .required('Password is required');
