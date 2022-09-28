import { Flex, FlexProps, Spacer } from '@chakra-ui/react';
import { MainFooter } from '../elements/MainFooter/MainFooter';
import { HeaderSpacer } from '../header';
import { Header } from '../header/Header';
import { HeaderBreadcrumb } from '../header/HeaderBreadcrumb';

interface MainLayoutProps {
  title: string;
  hideRouterBreadcrumb?: boolean;
  hideFooter?: boolean;
}

export const MainLayout = ({
  title,
  hideRouterBreadcrumb,
  hideFooter,
  children,
  ...props
}: MainLayoutProps & FlexProps & React.PropsWithChildren<unknown>) => {
  const headerBreadcrumb: React.ReactNode = (
    <HeaderBreadcrumb
      visibility={{ base: 'hidden', md: 'visible' }}
      display={{ base: 'none', md: 'flex' }}
      routeItems={[{ name: title, path: location.pathname }]}
    />
  );

  return (
    <Flex
      direction='column'
      minH='100vh'
      ml={{ base: 0, md: 'navbarWidth' }}
      w={{ base: '100%', md: 'auto' }}
      px={{ base: 5, md: 8 }}
      pb={{ base: 5, md: 8 }}
      gap={6}
      {...props}
    >
      <Header routeBreadCrumb={headerBreadcrumb} />
      <HeaderSpacer
        visibility={{ base: 'visible', md: 'hidden' }}
        display={{ base: 'flex', md: 'none' }}
      />

      {!hideRouterBreadcrumb && (
        <HeaderBreadcrumb
          visibility={{ base: 'visible', md: 'hidden' }}
          display={{ base: 'flex', md: 'none' }}
          routeItems={[{ name: title, path: location.pathname }]}
        />
      )}
      {children}
      <Spacer />
      {!hideFooter && <MainFooter />}
    </Flex>
  );
};
