import { RegisterUserDTORolesEnum } from 'generated-api';
import { Auth } from '../../types';

export const basicAuth: Auth = {
  requiresAuth: true,
  isAuthPage: false,
  redirectUrl: '/login',
  roles: [
    RegisterUserDTORolesEnum.Organizer,
    RegisterUserDTORolesEnum.Staff,
    RegisterUserDTORolesEnum.Admin,
  ],
};
