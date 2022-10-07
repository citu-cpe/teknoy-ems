import type { AppProps } from 'next/app';
import router, { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { isRoleUnauthorized } from '../shared/helpers/is-role-unathorized';
import { AppProvider } from '../shared/providers/AppProvider';
import { ThemeProvider } from '../shared/providers/ThemeProvider';
import { useGlobalStore } from '../shared/stores';
import '../styles/globals.scss';
import '@fullcalendar/react/dist/vdom';
import '@fullcalendar/common/main.css';
import '@fullcalendar/list/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import { NextPage } from 'next';
import { UserDTO } from 'generated-api';
import { Auth } from '../shared/types';
import { MainLayout } from '../shared/components/layout';
import { Center, Button, Icon } from '@chakra-ui/react';
import { BiArrowBack } from 'react-icons/bi';

type CustomPage = NextPage & {
  auth?: Auth;
};

interface CustomAppProps extends Omit<AppProps, 'Component'> {
  Component: CustomPage;
}

function MyApp({ Component, pageProps }: CustomAppProps) {
  const getUser = useGlobalStore((state) => state.getUser);
  const nextRouter = useRouter();

  const [showPage, setShowPage] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const handleAuth = useCallback(
    (user: UserDTO | undefined, auth: Auth) => {
      const { requiresAuth, isAuthPage, roles, redirectUrl } = auth;

      const HOME_ROUTE = '/';
      const LOGIN_URL = '/login';
      const FIRST_LOGIN_URL = '/first-login';

      if (requiresAuth && !user) {
        nextRouter.replace(LOGIN_URL);
        return;
      }

      if (user && isAuthPage) {
        nextRouter.replace(HOME_ROUTE);
        return;
      }

      if (user?.isFirstLogin && nextRouter.pathname !== FIRST_LOGIN_URL) {
        nextRouter.replace(FIRST_LOGIN_URL);
        return;
      }

      if (user && isRoleUnauthorized(user, roles)) {
        setUnauthorized(true);

        if (redirectUrl) {
          nextRouter.replace(redirectUrl);
        }

        return;
      }

      setUnauthorized(false);
      setShowPage(true);
    },
    [nextRouter]
  );

  useEffect(() => {
    const user = getUser();
    const auth = Component.auth;

    if (auth) {
      handleAuth(user, auth);
    } else {
      setUnauthorized(false);
      setShowPage(true);
    }
  }, [Component, getUser, handleAuth, pageProps, nextRouter, showPage]);

  return (
    <ThemeProvider>
      <AppProvider>
        {showPage && !unauthorized && <Component {...pageProps} />}
        {unauthorized && <UnauthorizedPage {...pageProps} />}
        <ReactQueryDevtools initialIsOpen={false} />
      </AppProvider>
    </ThemeProvider>
  );
}

export const UnauthorizedPage = () => {
  return (
    <MainLayout title='Unauthorized' maxH='100vh'>
      <Center flexDir='column' w='100%' h='100vh' gap={3}>
        <Center>
          Sorry, the page you are trying to access is unauthorized.
        </Center>
        <Button
          leftIcon={<Icon as={BiArrowBack} mr={2} my={0} py={0} h='100%' />}
          variant='outline'
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Center>
    </MainLayout>
  );
};

export default MyApp;
