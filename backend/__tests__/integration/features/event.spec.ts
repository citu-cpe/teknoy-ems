<<<<<<< HEAD
import { HttpStatus } from '@nestjs/common';
import {
  EventCreateDTO,
  EventTypeEnum,
  StatusEnum,
  ViewAccessEnum,
} from '../../../src/event/dto/event-create.dto';
import { EventDTO } from '../../../src/event/dto/event.dto';
import { SortedEquipmentsDTO } from '../../../src/event/dto/sorted-equipments.dto';
import { SortedVenuesDTO } from '../../../src/event/dto/sorted-venues.dto';
import { EventController } from '../../../src/event/event.controller';
import {
  addEquipmentWithoutSched,
  addSchedToEquipment,
} from '../../../src/global/test-data/equipment-test-data.service';
import { testEvent } from '../../../src/global/test-data/event-test-data.service';
import { testOrganizerDepartment } from '../../../src/global/test-data/organizer-test-data.service';
import {
  addSchedToVenueCC,
  venueTestCC,
  venueTestGYM,
} from '../../../src/global/test-data/venue-test-data.service';
import { ValidationErrorDTO } from '../../../src/shared/dto/validation-error.dto';
import { requestWithStaff } from '../setup';

describe('event.spec.ts - Event Controller', () => {
  const eventApiPath = EventController.EVENT_API_PATH;
  const verifyEventCreationApiPath =
    eventApiPath + EventController.VERIFY_EVENT_CREATION_API_PATH;

  const validEventCreateDTO: EventCreateDTO = {
    title: 'test',
    description: 'test',
    status: StatusEnum.PENDING,
    startTime: new Date('2022-09-10 2:00:00 PM'),
    endTime: new Date('2022-09-10 5:00:00 PM'),
    contactPerson: 'test',
    contactNumber: '999-409-4388',
    approvedBy: 'test',
    viewAccess: ViewAccessEnum.PRIVATE,
    type: EventTypeEnum.CAMPUS_WIDE,
    additionalNotes: 'test',
    organizerId: testOrganizerDepartment.id,
    equipmentIds: [addEquipmentWithoutSched.id],
    venueIds: [venueTestCC.id, venueTestGYM.id],
  };

  describe('GET /', () => {
    it('should get all events', async () => {
      await requestWithStaff.get(eventApiPath).expect(HttpStatus.OK);
    });
  });

  describe('GET /:id', () => {
    it('should get event by id', async () => {
      await requestWithStaff
        .get(eventApiPath + '/' + testEvent.id)
        .expect(HttpStatus.OK);
    });

    it('should not get event with id that does not exist', async () => {
      await requestWithStaff
        .get(eventApiPath + '/' + testEvent.id + 'random-characters')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /', () => {
    it('should create event', async () => {
      await requestWithStaff
        .post(eventApiPath)
        .send(validEventCreateDTO)
        .expect(HttpStatus.CREATED);
    });

    it('should not create event with invalid data', async () => {
      const reservedEventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        status: StatusEnum.RESERVED,
      };

      const invalidPhoneNumberEventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        contactNumber: 'not a phone number',
      };

      await requestWithStaff
        .post(eventApiPath)
        .send()
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(eventApiPath)
        .send(reservedEventDTO)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(eventApiPath)
        .send(invalidPhoneNumberEventDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create event with invalid equipments', async () => {
      const eventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        startTime: addSchedToEquipment.startTime, // same startTime as existing schedule
        endTime: addSchedToEquipment.endTime, // same endTime as existing schedule
      };

      await requestWithStaff
        .post(eventApiPath)
        .send(eventDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create event with invalid venues', async () => {
      const eventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        startTime: addSchedToVenueCC.startTime, // same startTime as existing schedule
        endTime: addSchedToVenueCC.endTime, // same endTime as existing schedule
      };

      await requestWithStaff
        .post(eventApiPath)
        .send(eventDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PUT /:id', () => {
    it('should update event', async () => {
      const eventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        title: 'new title',
      };

      await requestWithStaff
        .put(eventApiPath + '/' + testEvent.id)
        .send(eventDTO)
        .expect(HttpStatus.OK);
    });

    it('should not update event with invalid data', async () => {
      const invalidPhoneNumberEventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        contactNumber: 'not a phone number',
      };

      await requestWithStaff
        .put(eventApiPath + '/' + testEvent.id)
        .send()
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .put(eventApiPath + '/' + testEvent.id)
        .send(invalidPhoneNumberEventDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update event with invalid equipments', async () => {
      const createEventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        title: 'new title',
      };

      const { body } = await requestWithStaff
        .post(eventApiPath)
        .send(createEventDTO)
        .expect(HttpStatus.CREATED);

      const eventId = (body as EventDTO).id;

      const eventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        startTime: addSchedToEquipment.startTime, // same startTime as existing schedule
        endTime: addSchedToEquipment.endTime, // same endTime as existing schedule
      };

      await requestWithStaff
        .put(eventApiPath + '/' + eventId)
        .send(eventDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update event with invalid venues', async () => {
      const createEventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        title: 'new title',
      };

      const { body } = await requestWithStaff
        .post(eventApiPath)
        .send(createEventDTO)
        .expect(HttpStatus.CREATED);

      const eventId = (body as EventDTO).id;

      const eventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        startTime: addSchedToVenueCC.startTime, // same startTime as existing schedule
        endTime: addSchedToVenueCC.endTime, // same endTime as existing schedule
      };

      await requestWithStaff
        .put(eventApiPath + '/' + eventId)
        .send(eventDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete event', async () => {
      await requestWithStaff
        .delete(eventApiPath + '/' + testEvent.id)
        .expect(HttpStatus.OK);
    });

    it('should not delete event with invalid id', async () => {
      await requestWithStaff
        .delete(eventApiPath + '/' + testEvent.id + 'random-characters')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /sorted-equipments', () => {
    it('should get sorted equipments', async () => {
      const { body } = await requestWithStaff
        .get(
          eventApiPath +
            '/' +
            testEvent.id +
            EventController.SORTED_EQUIPMENTS_API_PATH
        )
        .expect(HttpStatus.OK);

      const { availableEquipments, unavailableEquipments } =
        body as SortedEquipmentsDTO;
      expect(availableEquipments.length).toEqual(1);
      expect(unavailableEquipments.length).toEqual(0);
    });
  });

  describe('GET /sorted-venues', () => {
    it('should get sorted venues', async () => {
      const { body } = await requestWithStaff
        .get(
          eventApiPath +
            '/' +
            testEvent.id +
            EventController.SORTED_VENUES_API_PATH
        )
        .expect(HttpStatus.OK);

      const { availableVenues, unavailableVenues } = body as SortedVenuesDTO;

      expect(availableVenues.length).toEqual(2);
      expect(unavailableVenues.length).toEqual(0);
    });
  });

  describe('POST /verify-event-creation', () => {
    it('should get validation errors', async () => {
      const { body } = await requestWithStaff
        .post(verifyEventCreationApiPath)
        .send(validEventCreateDTO)
        .expect(HttpStatus.OK);

      const { errorFields, hasErrors } = body as ValidationErrorDTO;

      expect(errorFields.length).toBe(0);
      expect(hasErrors).toBe(false);
    });
  });
});
=======
import { HttpStatus } from '@nestjs/common';
import {
  EventCreateDTO,
  EventTypeEnum,
  StatusEnum,
  ViewAccessEnum,
} from '../../../src/event/dto/event-create.dto';
import { EventDTO } from '../../../src/event/dto/event.dto';
import { SortedEquipmentsDTO } from '../../../src/event/dto/sorted-equipments.dto';
import { SortedVenuesDTO } from '../../../src/event/dto/sorted-venues.dto';
import { EventController } from '../../../src/event/event.controller';
import {
  addEquipmentWithoutSched,
  addSchedToEquipment,
} from '../../../src/global/test-data/equipment-test-data.service';
import { testEvent } from '../../../src/global/test-data/event-test-data.service';
import { testOrganizerDepartment } from '../../../src/global/test-data/organizer-test-data.service';
import {
  addSchedToVenueCC,
  venueTestCC,
  venueTestGYM,
} from '../../../src/global/test-data/venue-test-data.service';
import { ValidationErrorDTO } from '../../../src/shared/dto/validation-error.dto';
import { requestWithStaff } from '../setup';

describe('event.spec.ts - Event Controller', () => {
  const eventApiPath = EventController.EVENT_API_PATH;
  const verifyEventCreationApiPath =
    eventApiPath + EventController.VERIFY_EVENT_CREATION_API_PATH;

  const validEventCreateDTO: EventCreateDTO = {
    title: 'test',
    description: 'test',
    status: StatusEnum.PENDING,
    startTime: new Date('2022-09-10 2:00:00 PM'),
    endTime: new Date('2022-09-10 5:00:00 PM'),
    contactPerson: 'test',
    contactNumber: '999-409-4388',
    approvedBy: 'test',
    viewAccess: ViewAccessEnum.PRIVATE,
    type: EventTypeEnum.CAMPUS_WIDE,
    additionalNotes: 'test',
    organizerId: testOrganizerDepartment.id,
    equipmentIds: [addEquipmentWithoutSched.id],
    venueIds: [venueTestCC.id, venueTestGYM.id],
  };

  describe('GET /', () => {
    it('should get all events', async () => {
      await requestWithStaff.get(eventApiPath).expect(HttpStatus.OK);
    });
  });

  describe('GET /:id', () => {
    it('should get event by id', async () => {
      await requestWithStaff
        .get(eventApiPath + '/' + testEvent.id)
        .expect(HttpStatus.OK);
    });

    it('should not get event with id that does not exist', async () => {
      await requestWithStaff
        .get(eventApiPath + '/' + testEvent.id + 'random-characters')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /', () => {
    it('should create event', async () => {
      await requestWithStaff
        .post(eventApiPath)
        .send(validEventCreateDTO)
        .expect(HttpStatus.CREATED);
    });

    it('should not create event with invalid data', async () => {
      const reservedEventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        status: StatusEnum.RESERVED,
      };

      const invalidPhoneNumberEventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        contactNumber: 'not a phone number',
      };

      await requestWithStaff
        .post(eventApiPath)
        .send()
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(eventApiPath)
        .send(reservedEventDTO)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(eventApiPath)
        .send(invalidPhoneNumberEventDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create event with invalid equipments', async () => {
      const eventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        startTime: addSchedToEquipment.startTime, // same startTime as existing schedule
        endTime: addSchedToEquipment.endTime, // same endTime as existing schedule
      };

      await requestWithStaff
        .post(eventApiPath)
        .send(eventDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create event with invalid venues', async () => {
      const eventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        startTime: addSchedToVenueCC.startTime, // same startTime as existing schedule
        endTime: addSchedToVenueCC.endTime, // same endTime as existing schedule
      };

      await requestWithStaff
        .post(eventApiPath)
        .send(eventDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PUT /:id', () => {
    it('should update event', async () => {
      const eventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        title: 'new title',
      };

      await requestWithStaff
        .put(eventApiPath + '/' + testEvent.id)
        .send(eventDTO)
        .expect(HttpStatus.OK);
    });

    it('should not update event with invalid data', async () => {
      const invalidPhoneNumberEventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        contactNumber: 'not a phone number',
      };

      await requestWithStaff
        .put(eventApiPath + '/' + testEvent.id)
        .send()
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .put(eventApiPath + '/' + testEvent.id)
        .send(invalidPhoneNumberEventDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update event with invalid equipments', async () => {
      const createEventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        title: 'new title',
      };

      const { body } = await requestWithStaff
        .post(eventApiPath)
        .send(createEventDTO)
        .expect(HttpStatus.CREATED);

      const eventId = (body as EventDTO).id;

      const eventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        startTime: addSchedToEquipment.startTime, // same startTime as existing schedule
        endTime: addSchedToEquipment.endTime, // same endTime as existing schedule
      };

      await requestWithStaff
        .put(eventApiPath + '/' + eventId)
        .send(eventDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update event with invalid venues', async () => {
      const createEventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        title: 'new title',
      };

      const { body } = await requestWithStaff
        .post(eventApiPath)
        .send(createEventDTO)
        .expect(HttpStatus.CREATED);

      const eventId = (body as EventDTO).id;

      const eventDTO: EventCreateDTO = {
        ...validEventCreateDTO,
        startTime: addSchedToVenueCC.startTime, // same startTime as existing schedule
        endTime: addSchedToVenueCC.endTime, // same endTime as existing schedule
      };

      await requestWithStaff
        .put(eventApiPath + '/' + eventId)
        .send(eventDTO)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete event', async () => {
      await requestWithStaff
        .delete(eventApiPath + '/' + testEvent.id)
        .expect(HttpStatus.OK);
    });

    it('should not delete event with invalid id', async () => {
      await requestWithStaff
        .delete(eventApiPath + '/' + testEvent.id + 'random-characters')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /sorted-equipments', () => {
    it('should get sorted equipments', async () => {
      const { body } = await requestWithStaff
        .get(
          eventApiPath +
            '/' +
            testEvent.id +
            EventController.SORTED_EQUIPMENTS_API_PATH
        )
        .expect(HttpStatus.OK);

      const { availableEquipments, unavailableEquipments } =
        body as SortedEquipmentsDTO;
      expect(availableEquipments.length).toEqual(1);
      expect(unavailableEquipments.length).toEqual(0);
    });
  });

  describe('GET /sorted-venues', () => {
    it('should get sorted venues', async () => {
      const { body } = await requestWithStaff
        .get(
          eventApiPath +
            '/' +
            testEvent.id +
            EventController.SORTED_VENUES_API_PATH
        )
        .expect(HttpStatus.OK);

      const { availableVenues, unavailableVenues } = body as SortedVenuesDTO;

      expect(availableVenues.length).toEqual(2);
      expect(unavailableVenues.length).toEqual(0);
    });
  });

  describe('POST /verify-event-creation', () => {
    it('should get validation errors', async () => {
      const { body } = await requestWithStaff
        .post(verifyEventCreationApiPath)
        .send(validEventCreateDTO)
        .expect(HttpStatus.OK);

      const { errorFields, hasErrors } = body as ValidationErrorDTO;

      expect(errorFields.length).toBe(0);
      expect(hasErrors).toBe(false);
    });
  });
});
>>>>>>> 1078e1a (feat(venue):TEMS-60 implement venues frontend CRUD)
