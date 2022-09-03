import { ChangePasswordDTO } from 'generated-api';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useChangePassword = () => {
  const api = useContext(ApiContext);

  return useMutation((passwordDTO: ChangePasswordDTO) =>
    api.changePassword(passwordDTO)
  );
};
