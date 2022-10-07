import { RegisterUserDTORolesEnum, UserDTO } from 'generated-api';

/**
 * Helper function to check if user `roles` (array) match with page authorized `roles` (array)
 */
export const isRoleUnauthorized = (
  user: UserDTO,
  roles: RegisterUserDTORolesEnum[]
): boolean => {
  let result = true; // unauthorize user by default

  if (roles == null || roles.length <= 0) {
    return false;
  }

  user.roles.forEach((role) => {
    roles.forEach((pageRole) => {
      if (role.toString() === pageRole.toString()) {
        result = false; // OK! user roles has authorization
        return;
      }
    });
  });

  return result;
};
