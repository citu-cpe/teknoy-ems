import { RegisterUserDTORolesEnum } from 'generated-api';

export interface Auth {
  /**
   * Option for routes that require user authentication (e.g. Dashboard, Settings, Events, etc.)
   */
  requiresAuth: boolean;
  /**
   * Set to `true` for Authentication-related pages (e.g. Login)
   * which will be hidden after user is authenticated
   */
  isAuthPage: boolean;
  /**
   * If this option is specified, unauthorized visit will redirect the user the provided route
   */
  redirectUrl?: string;
  /**
   * Authorized user `roles` of a page/route
   */
  roles: RegisterUserDTORolesEnum[];
}
