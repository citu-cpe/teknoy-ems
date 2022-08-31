import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
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
