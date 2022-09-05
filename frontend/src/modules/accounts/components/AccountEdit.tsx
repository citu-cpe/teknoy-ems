import { UserDTO } from 'generated-api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { MainLayout } from '../../../shared/components/layout';
import { useAccounts } from '../hooks/useAccounts';
import { AccountEditForm } from './AccountEditForm';

export const AccountEdit = () => {
  const router = useRouter();
  const id = router.query?.id as string;

  const mutations = useAccounts();

  const [userDTO, setUserDTO] = useState<UserDTO>();

  useEffect(() => {
    mutations.fetchUserById.mutate(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mutations.fetchUserById.isSuccess) {
      setUserDTO(mutations.fetchUserById.data.data);
    }
  }, [mutations]);

  const handleComplete = () => {
    router.push('/accounts');
  };

  return (
    <MainLayout>
      <ContentHeader title='Account Edit' />
      <ContentSection>
        {userDTO && (
          <AccountEditForm initialUser={userDTO} onComplete={handleComplete} />
        )}
      </ContentSection>
    </MainLayout>
  );
};
