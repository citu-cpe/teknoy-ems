import type { AppProps } from 'next/app';
import router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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
import { RegisterUserDTORolesEnum, UserDTO } from 'generated-api';
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
  const router = useRouter();
  const [showPage, setShowPage] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  console.log('showPage1', showPage);

  if (!showPage) {
    console.log('hoy');
  }

  useEffect(() => {
    // if (pageProps.protected && !user) {
    //   router.replace('/login');
    // } else if (pageProps.dontShowUser && user) {
    //   router.replace('/');
    // } else if (user?.isFirstLogin && router.pathname !== '/first-login') {
    //   router.replace('/first-login');
    // } else if (user && isRoleUnauthorized(user, pageProps.auth.roles)) {
    //   router.replace('/unauthorized');
    // } else {
    //   setShowPage(true);
    // }

    console.log('useeffect');
    console.log('showPage', showPage);

    const user = getUser();
    const auth = Component.auth;
    // console.log(isRoleUnauthorized(user, roles));
    // const {
    //   roles,
    //   loadingSkeleton: loading,
    //   redirectUrl,
    // } = Component.auth || {};

    console.log(auth);

    if (auth) {
      handleAuth(user, auth);
    } else {
      setUnauthorized(false);
      setShowPage(true);
    }
  }, [Component, getUser, pageProps, router, showPage]);

  const handleAuth = (user: UserDTO | undefined, auth: Auth) => {
    console.log('auth....');
    const { requiresAuth, isAuthPage, roles, redirectUrl } = auth;

    const LOGIN_URL = '/login';
    const FIRST_LOGIN_URL = '/first-login';
    const HOME_ROUTE = '/';

    if (requiresAuth && !user) {
      console.log('requier login');
      router.replace(LOGIN_URL);
      return;
    }

    if (user && isAuthPage) {
      console.log('redirect to home');
      router.replace(HOME_ROUTE);
      return;
    }

    if (user?.isFirstLogin && router.pathname !== FIRST_LOGIN_URL) {
      console.log('first login');
      router.replace(FIRST_LOGIN_URL);
      return;
    }

    if (user && isRoleUnauthorized(user, roles)) {
      setUnauthorized(true);

      if (redirectUrl) {
        console.log('unauthorized redirected');
        router.replace(redirectUrl);
      }

      return;
    }

    console.log('okay');
    setUnauthorized(false);
    setShowPage(true);
  };

  console.log('return', showPage && !!unauthorized);
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
