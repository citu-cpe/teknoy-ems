import { ChakraProvider } from '@chakra-ui/react';
import { useContext } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ApiProvider } from './ApiProvider';
import { SocketProvider } from './SocketProvider';
import { ThemeContext } from './ThemeProvider';

const queryClient = new QueryClient();

export const AppProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <ChakraProvider theme={currentTheme.value}>
      <ApiProvider>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>{children}</SocketProvider>
        </QueryClientProvider>
      </ApiProvider>
    </ChakraProvider>
  );
};
