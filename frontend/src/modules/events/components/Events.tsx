import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { LinkButton, Modal } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { EventAddForm } from './EventAddForm';
import { EventAddSuccess } from './EventAddSuccess';
import { EventsCalendar } from './EventsCalendar';

export const Events = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <MainLayout title='Events'>
      <ContentHeader
        title='Events'
        actions={
          <LinkButton
            variant='solid'
            // onClick={onAddOpen}
            label='Reserve Event'
            route='/events/reserve'
            data-cy='reserve-events-btn'
          />
        }
      />
      <ContentSection>
        <EventsCalendar />
      </ContentSection>
    </MainLayout>
  );
};
