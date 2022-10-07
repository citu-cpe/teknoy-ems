import { Button, useDisclosure } from '@chakra-ui/react';
import { RegisterUserDTO, RegisterUserDTORolesEnum } from 'generated-api';
import { useState } from 'react';
import { AccountRegisterForm } from '.';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { Modal } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { Auth } from '../../../shared/types';
import { AccountRegisterSuccess } from './AccountRegisterSuccess';
import { AccountsTable } from './AccountsTable';

export const Accounts = () => {
  // const { getUser } = useGlobalStore();
  // getUser()

  const [refresh, setRefresh] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<
    RegisterUserDTO | undefined
  >(undefined);

  const {
    onOpen: onRegisterOpen,
    isOpen: isRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const {
    onOpen: onSuccessOpen,
    isOpen: isSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure();

  const handleComplete = (registerDTO: RegisterUserDTO) => {
    setRegisteredUser(registerDTO);
    onRegisterClose();
    onSuccessOpen();
    setRefresh(!refresh);
  };

  const handleRegisterAgain = () => {
    setRegisteredUser(undefined);
    onRegisterOpen();
    onSuccessClose();
  };

  const handleSuccessClose = () => {
    setRegisteredUser(undefined);
    onSuccessClose();
    setRefresh(!refresh);
  };

  return (
    <MainLayout title='Accounts'>
      <ContentHeader
        title='Accounts'
        actions={
          <Button
            variant='solid'
            onClick={onRegisterOpen}
            data-cy='register-account-btn'
          >
            Register Account
          </Button>
        }
      />

      <ContentSection>
        <AccountsTable refresh={refresh} />
      </ContentSection>

      <Modal
        title='Account Register'
        isOpen={isRegisterOpen}
        onClose={onRegisterClose}
      >
        <AccountRegisterForm onComplete={handleComplete} />
      </Modal>

      <Modal isOpen={isSuccessOpen} onClose={handleSuccessClose}>
        <AccountRegisterSuccess
          registerDTO={registeredUser}
          onClose={handleSuccessClose}
          onConfirm={handleRegisterAgain}
        />
      </Modal>
    </MainLayout>
  );
};

const auth: Auth = {
  redirectUrl: '/organizers',
  roles: [RegisterUserDTORolesEnum.Organizer],
};

Accounts.auth = auth;
