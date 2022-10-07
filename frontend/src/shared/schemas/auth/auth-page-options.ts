import { Auth } from '../../types';

export const authPage: Auth = {
  requiresAuth: false,
  isAuthPage: true,
  redirectUrl: '/login',
  roles: [],
};
