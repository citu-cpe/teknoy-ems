import * as yup from 'yup';

export const confirmPasswordValidator = (passwordRef: string = 'password') =>
  yup
    .string()
    .oneOf([yup.ref(passwordRef), null], 'Passwords must match')
    .required('Confirm password is required');
