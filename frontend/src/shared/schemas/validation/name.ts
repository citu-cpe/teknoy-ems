import * as yup from 'yup';

export const MIN_NAME_LENGTH = 1;
export const MAX_NAME_LENGTH = 50;

export const name = yup
  .string()
  .max(MAX_NAME_LENGTH, `Must be at least ${MAX_NAME_LENGTH} characters`)
  .max(MAX_NAME_LENGTH, `Must be ${MAX_NAME_LENGTH} characters or less`)
  .matches(/^([A-Za-zA-ZÀ-ÖÙ-öù-ÿĀ-žḀ-ỿ ])*$/, 'Please enter valid name')
  .required('Required');
