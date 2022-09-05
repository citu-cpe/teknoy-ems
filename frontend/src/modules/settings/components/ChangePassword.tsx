import { UserDTO } from 'generated-api';
import { useRouter } from 'next/router';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { MainLayout } from '../../../shared/components/layout';
import { useToast } from '../../../shared/hooks';
import { useGlobalStore } from '../../../shared/stores';
import { ChangePasswordForm } from './ChangePasswordForm';

export const ChangePassword = () => {
  const toast = useToast();
  const router = useRouter();

  const { setUser } = useGlobalStore();

  const handleComplete = (userDTO: UserDTO) => {
    setUser(userDTO);

    toast({ title: 'Password changed successfully' });

    router.push('/settings');
  };

  return (
    <MainLayout>
      <ContentHeader title='Change Password' />
      <ContentSection>
        <ChangePasswordForm onComplete={handleComplete} />
      </ContentSection>
    </MainLayout>
  );
};
