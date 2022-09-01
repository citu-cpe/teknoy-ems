import * as yup from 'yup';

export const email = yup
  .string()
  .email('Please enter a valid email')
  .required('Email is required');
