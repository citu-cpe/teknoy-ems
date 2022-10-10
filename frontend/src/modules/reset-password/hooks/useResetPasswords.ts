import { ResetPasswordDTO, ResetPasswordLinkDTO } from 'generated-api';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useResetPasswords = () => {
  const api = useContext(ApiContext);

  const sendResetPasswordLink = useMutation(
    (resetPasswordLinkDTO: ResetPasswordLinkDTO) =>
      api.sendResetPasswordLink(resetPasswordLinkDTO)
  );

  const resetPassword = useMutation((resetPasswordDTO: ResetPasswordDTO) =>
    api.resetPassword(resetPasswordDTO)
  );

  return { sendResetPasswordLink, resetPassword };
};
