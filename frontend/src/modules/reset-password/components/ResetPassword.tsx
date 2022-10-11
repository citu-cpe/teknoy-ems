import { Flex, Heading, Text } from '@chakra-ui/react';
import router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ContentSection } from '../../../shared/components/content';
import { BackButton } from '../../../shared/components/elements';
import { ThemeModeToggleFloat } from '../../../shared/components/header';
import { ResetLinkSent } from './ResetLinkSent';
import { ResetPasswordForm } from './ResetPasswordForm';
import { ResetPasswordLinkForm } from './ResetPasswordLinkForm';
import { ResetPasswordSuccess } from './ResetPasswordSuccess';

export const ResetPassword = () => {
  const nextRouter = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (nextRouter.query.token) {
      setToken(nextRouter.query.token as string);
    }
  }, [nextRouter.query?.token]);

  const handleResetLinkComplete = (email: string) => {
    setUserEmail(email);
  };

  const handleResetComplete = () => {
    setResetSuccess(true);

    setTimeout(() => {
      router.push('/login');
    }, 3000);
  };

  return (
    <Flex
      direction='column'
      h='100vh'
      alignItems='stretch'
      justifyContent='center'
      gap={3}
      w='full'
      maxW='container.sm'
      mx='auto'
      textAlign='center'
      p={3}
    >
      {userEmail ? (
        <ResetLinkSent email={userEmail} />
      ) : resetSuccess ? (
        <ResetPasswordSuccess />
      ) : (
        <>
          <Heading as='h1'>Reset Password</Heading>
          <Text mb={3}>
            Please input {!token ? 'account email' : `the new password.`}
          </Text>

          <ContentSection maxW='xl' minW={{ base: 'auto', lg: 'lg' }} mx='auto'>
            {!token ? (
              <ResetPasswordLinkForm onComplete={handleResetLinkComplete} />
            ) : (
              <ResetPasswordForm
                token={token}
                onComplete={handleResetComplete}
              />
            )}
          </ContentSection>
        </>
      )}

      <BackButton />
      <ThemeModeToggleFloat />
    </Flex>
  );
};
