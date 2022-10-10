import { Button } from '@chakra-ui/react';
import { ContentHeader } from '../../../shared/components/content';
import { MainLayout } from '../../../shared/components/layout/MainLayout';
import { basicAuth } from '../../../shared/schemas';

export const Dashboard = () => {
  return (
    <MainLayout title='Dashboard'>
      <ContentHeader
        title='Dashboard'
        actions={
          <Button variant='solid' data-cy='reserve-event-btn'>
            Reserve Event
          </Button>
        }
      />
    </MainLayout>
  );
};

Dashboard.auth = basicAuth;
