import { ContentHeader } from '../../../shared/components/content';
import { MainLayout } from '../../../shared/components/layout';
import { ChangePasswordForm } from './ChangePasswordForm';

export const ChangePassword = () => {
  return (
    <MainLayout>
      <ContentHeader title='Change Password' />
      <ChangePasswordForm />
    </MainLayout>
  );
};
