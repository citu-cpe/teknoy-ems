import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { isRoleUnauthorized } from '../shared/helpers/is-role-unathorized';
import { AppProvider } from '../shared/providers/AppProvider';
import { ThemeProvider } from '../shared/providers/ThemeProvider';
import { useGlobalStore } from '../shared/stores';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  const getUser = useGlobalStore((state) => state.getUser);
  const router = useRouter();
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    const user = getUser();

    if (pageProps.protected && !user) {
      router.replace('/login');
    } else if (pageProps.dontShowUser && user) {
      router.replace('/');
    } else if (user?.isFirstLogin && router.pathname !== '/first-login') {
      router.replace('/first-login');
    } else if (user && isRoleUnauthorized(user, pageProps.roles)) {
      router.replace('/unauthorized');
    } else {
      setShowPage(true);
    }
  }, [getUser, pageProps, router]);

  return (
    <ThemeProvider>
      <AppProvider>
        {showPage && <Component {...pageProps} />}
        <ReactQueryDevtools initialIsOpen={false} />
      </AppProvider>
    </ThemeProvider>
  );
}

export default MyApp;
