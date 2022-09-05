import { UserDTO } from 'generated-api';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useEdit = () => {
  const api = useContext(ApiContext);

  return useMutation((userDTO: UserDTO) => api.editUser(userDTO.id, userDTO));
};
