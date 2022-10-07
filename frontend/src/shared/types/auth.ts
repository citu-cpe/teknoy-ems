import { RegisterUserDTORolesEnum } from 'generated-api';

export interface Auth {
  redirectUrl: string;
  roles: RegisterUserDTORolesEnum[];
  loading?: RegisterUserDTORolesEnum[];
}
