import * as yup from 'yup';

export const emailValidator = yup
  .string()
  .email('Please enter a valid email')
  .required('Email is required');
