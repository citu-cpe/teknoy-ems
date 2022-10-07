import { RegisterUserDTORolesEnum } from 'generated-api';
import { Auth } from '../../types';

export const adminOnlyAuth: Auth = {
  requiresAuth: true,
  isAuthPage: false,
  roles: [RegisterUserDTORolesEnum.Admin],
};
