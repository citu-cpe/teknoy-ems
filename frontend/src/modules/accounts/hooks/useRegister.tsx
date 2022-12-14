import { RegisterUserDTO } from 'generated-api';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useRegister = () => {
  const api = useContext(ApiContext);

  return useMutation((registerDTO: RegisterUserDTO) =>
    api.register(registerDTO)
  );
};
