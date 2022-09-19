import { CalendarOptions } from '@fullcalendar/common';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useRef } from 'react';

export const EventsCalendar = ({
  ...props
}: CalendarOptions | Readonly<CalendarOptions>) => {
  const calendarRef = useRef(null);

  return (
    <FullCalendar
      timeZone='Asia/Manila'
      plugins={[timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin]}
      initialView='dayGridMonth'
      initialEvents={[
        { title: 'nice event', start: new Date(), resourceId: 'a' },
      ]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      }}
      editable
      selectable
      {...props}
    />
  );
};
