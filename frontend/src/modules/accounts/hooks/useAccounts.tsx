import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useAccounts = () => {
  const api = useContext(ApiContext);

  const fetchUserById = useMutation((id: string) => api.getUserById(id));

  return { fetchUserById };
};
