import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { RegisterUserDTO } from 'generated-api';
import { useState } from 'react';
import { AccountRegisterForm } from '.';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { LinkButton, Modal } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { adminOnlyAuth } from '../../../shared/schemas';
import { AccountRegisterSuccess } from './AccountRegisterSuccess';
import { AccountsTable } from './AccountsTable';

export const Accounts = () => {
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

Accounts.auth = adminOnlyAuth;
