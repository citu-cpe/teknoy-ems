import { Center } from '@chakra-ui/react';
import { MainLayout } from '../../../shared/components/layout';

export const Unauthorized = () => {
  return (
    <MainLayout>
      <Center>Sorry, the page you are trying to access is unauthorized.</Center>
    </MainLayout>
  );
};
