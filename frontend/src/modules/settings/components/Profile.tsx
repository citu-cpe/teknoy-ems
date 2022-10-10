import { UserDTO } from 'generated-api';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { MainLayout } from '../../../shared/components/layout';
import { basicAuth } from '../../../shared/schemas';
import { useGlobalStore } from '../../../shared/stores';
import { ProfileEditForm } from './ProfileEditForm';

export const Profile = () => {
  const router = useRouter();
  const { getUser, setUser } = useGlobalStore();
  const [userDTO] = useState<UserDTO | undefined>(getUser());

  const handleComplete = (updatedUser: UserDTO) => {
    setUser(updatedUser);
    router.push('/settings');
  };

  return (
    <MainLayout title='Profile'>
      <ContentHeader title='Profile Edit' />
      {userDTO && (
        <ContentSection>
          <ProfileEditForm initialUser={userDTO} onComplete={handleComplete} />
        </ContentSection>
      )}
    </MainLayout>
  );
};

Profile.auth = basicAuth;
