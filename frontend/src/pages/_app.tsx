import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
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
import { RegisterUserDTORolesEnum } from 'generated-api';
import { Auth } from '../shared/types';

type CustomPage = NextPage & {
  auth: Auth;
};

interface CustomAppProps extends Omit<AppProps, 'Component'> {
  Component: CustomPage;
}

function MyApp({ Component, pageProps }: CustomAppProps) {
  const getUser = useGlobalStore((state) => state.getUser);
  const router = useRouter();
  const [showPage, setShowPage] = useState(false);

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
    // } else if (user && isRoleUnauthorized(user, pageProps.roles)) {
    //   router.replace('/unauthorized');
    // } else {
    //   setShowPage(true);
    // }

    console.log('useeffect');

    console.log('showPage', showPage);

    const user = getUser();
    // console.log(isRoleUnauthorized(user, roles));
    const { roles, loading, redirectUrl } = Component.auth || {};

    console.log({ Component });
    if (roles) {
      console.log(roles);
    }

    if (user && isRoleUnauthorized(user, roles)) {
      console.log('unauthorized');
      console.log(redirectUrl);
      setShowPage(false);
      router.replace(redirectUrl);
    } else {
      setShowPage(true);
    }

    if (user?.isFirstLogin && router.pathname !== '/first-login') {
      router.replace('/first-login');
    }
  }, [getUser, pageProps, router]);

  console.log('return');
  return (
    <ThemeProvider>
      <AppProvider>
        {showPage ? <Component {...pageProps} /> : <div>wew</div>}
        <ReactQueryDevtools initialIsOpen={false} />
      </AppProvider>
    </ThemeProvider>
  );
}

export default MyApp;
