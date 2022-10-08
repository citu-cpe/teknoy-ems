import { RegisterUserDTORolesEnum } from 'generated-api';
import { Auth } from '../../types';

export const staffAuth: Auth = {
  requiresAuth: true,
  isAuthPage: false,
  redirectUrl: '/login',
  roles: [RegisterUserDTORolesEnum.Staff, RegisterUserDTORolesEnum.Admin],
};
