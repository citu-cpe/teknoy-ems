import { Button, useDisclosure } from '@chakra-ui/react';
import { RegisterUserDTO } from 'generated-api';
import { useState } from 'react';
import { AccountRegisterForm } from '.';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { Modal } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { AccountRegisterSuccess } from './AccountRegisterSuccess';
import { AccountsTable } from './AccountsTable';

export const Accounts = () => {
  const [refresh, setRefresh] = useState(false);
  const [registerDTO, setRegisterDTO] = useState<RegisterUserDTO | undefined>(
    undefined
  );

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

  const handleComplete = (registeredUser: RegisterUserDTO) => {
    setRegisterDTO(registeredUser);
    onRegisterClose();
    onSuccessOpen();
    setRefresh(!refresh);
  };

  const handleRegisterAgain = () => {
    setRegisterDTO(undefined);
    onRegisterOpen();
    onSuccessClose();
  };

  return (
    <MainLayout>
      <ContentHeader
        title='Accounts'
        actions={
          <Button variant='solid' onClick={onRegisterOpen}>
            Register Account
          </Button>
        }
      />

      <ContentSection>
        <AccountsTable refresh={refresh} />
      </ContentSection>

      <Modal
        title='Account Edit'
        isOpen={isRegisterOpen}
        onClose={onRegisterClose}
      >
        <AccountRegisterForm onComplete={handleComplete} />
      </Modal>

      <Modal
        title='Register Success'
        isOpen={isSuccessOpen}
        onClose={onSuccessClose}
      >
        <AccountRegisterSuccess
          registerDTO={registerDTO}
          onClose={onSuccessClose}
          onRepeat={handleRegisterAgain}
        />
      </Modal>
    </MainLayout>
  );
};
