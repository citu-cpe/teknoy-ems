import { Button } from '@chakra-ui/react';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { MainLayout } from '../../../shared/components/layout';
import { EventsCalendar } from './EventsCalendar';

export const Events = () => {
  return (
    <MainLayout title='Events'>
      <ContentHeader
        title='Events'
        actions={
          <Button variant='solid' data-cy='reserve-events-btn'>
            Reserve Event
          </Button>
        }
      />
      <ContentSection>
        <EventsCalendar />
      </ContentSection>
    </MainLayout>
  );
};
