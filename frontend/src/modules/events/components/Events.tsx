import { ContentSection } from '../../../shared/components/content';
import { MainLayout } from '../../../shared/components/layout';
import { basicAuth } from '../../../shared/schemas';
import { EventsCalendar } from './EventsCalendar';

export const Events = () => {
  return (
    <MainLayout title='Events' maxH='100vh' hideFooter>
      <ContentSection h='100vh'>
        <EventsCalendar />
      </ContentSection>
    </MainLayout>
  );
};

Events.auth = basicAuth;
