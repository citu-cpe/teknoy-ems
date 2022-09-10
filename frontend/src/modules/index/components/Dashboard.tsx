import { Button, Center } from '@chakra-ui/react';
import { ContentHeader } from '../../../shared/components/content';
import { MainLayout } from '../../../shared/components/layout/MainLayout';

export const Dashboard = () => {
  return (
    <MainLayout title='Dashboard'>
      <ContentHeader
        title='TeknoyEMS'
        actions={
          <Button variant='solid' data-cy='reserve-event-btn'>
            Reserve Event
          </Button>
        }
      />
      <Center>Surpass your limits!</Center>
    </MainLayout>
  );
};
