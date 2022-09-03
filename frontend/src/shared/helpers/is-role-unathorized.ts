import { RegisterUserDTORolesEnum, UserDTO } from 'generated-api';

export const isRoleUnauthorized = (
  user: UserDTO,
  roles: typeof RegisterUserDTORolesEnum[]
): boolean => {
  let result = true;

  if (roles == null) {
    return false;
  }

  user.roles.forEach((role) => {
    roles.forEach((pageRole) => {
      if (role.toString() === pageRole.toString()) {
        result = false;
        return;
      }
    });
  });

  return result;
};
