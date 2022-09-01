import { ChangePasswordDTO } from 'generated-api';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { useToast } from '../../../shared/hooks';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useChangePassword = () => {
  const api = useContext(ApiContext);
  const toast = useToast();
  const router = useRouter();

  return useMutation(
    (passwordDTO: ChangePasswordDTO) => api.changePassword(passwordDTO),
    {
      onSuccess: () => {
        toast({ title: 'Password changed successfully' });
        router.push('/settings');
      },
    }
  );
};
