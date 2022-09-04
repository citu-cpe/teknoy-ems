import { HttpStatus } from '@nestjs/common';
import { string } from 'joi';
import {
  AvailabilityEnum,
  ScheduleDTO,
} from '../../../src/schedule/dto/schedule.dto';
import { ScheduleController } from '../../../src/schedule/schedule.controller';
import {
  createSchedule,
  testCreateSchedule,
} from '../fixtures/schedule.fixtures';
import { requestWithStaff } from '../setup';

describe('schedule.spec.ts - Schedule Controller', () => {
  const scheduleRoute = ScheduleController.SCHEDULE_API_PATH;
  // eslint-disable-next-line
  const idPath = scheduleRoute + ScheduleController.ID_API_PATH;

  describe('POST /', () => {
    // eslint-disable-next-line
    it('should create schedule when availability is AVAILABLE and startTime and endTime are provided', async () => {
      const { availability, startTime, endTime }: ScheduleDTO =
        await createSchedule(testCreateSchedule);

      expect(availability).toEqual(testCreateSchedule.availability);
      expect(startTime).toEqual(testCreateSchedule.startTime.toISOString());
      expect(endTime).toEqual(testCreateSchedule.endTime.toISOString());
    });

    it('should not create schedule when availability is UNAVAILABLE', async () => {
      const createUnavailableSched = {
        availability: AvailabilityEnum.UNAVAILABLE,
        startTime: new Date('2022-9-2 2:00:00 PM'),
        endTime: new Date('2022-9-2 5:00:00 PM'),
      };
      await requestWithStaff.post(scheduleRoute).expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(scheduleRoute)
        .send(createUnavailableSched)
        .expect(HttpStatus.BAD_REQUEST);
    });

    // eslint-disable-next-line
    it('should not create schedule with missing data', async () => {
      const createSchedWithoutStartTime = {
        availability: AvailabilityEnum.AVAILABLE,
        endTime: new Date('2022-9-3 5:00:00 PM'),
      };
      const createSchedWithoutEndTime = {
        availability: AvailabilityEnum.AVAILABLE,
        startTime: new Date('2022-9-3 2:00:00 PM'),
      };

      await requestWithStaff.post(scheduleRoute).expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(scheduleRoute)
        .send(createSchedWithoutStartTime)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(scheduleRoute)
        .send(createSchedWithoutEndTime)
        .expect(HttpStatus.BAD_REQUEST);
    });

    // eslint-disable-next-line
    it('should not create schedule when startTime is after endTime', async () => {
      const createStartTimeAfterEndTimeSched = {
        availability: AvailabilityEnum.AVAILABLE,
        startTime: new Date('2022-9-3 2:00:00 PM'),
        endTime: new Date('2022-9-3 1:00:00 PM'),
      };
      await requestWithStaff.post(scheduleRoute).expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(scheduleRoute)
        .send(createStartTimeAfterEndTimeSched)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /', () => {
    // eslint-disable-next-line
    it('should get all schedules', async () => {
      await requestWithStaff.get(scheduleRoute).expect(HttpStatus.OK);
    });
  });

  describe('GET /:id', () => {
    // eslint-disable-next-line
    it('should get schedule by id', async() => {
      const id = '9a52e495-a1ec-49e0-acb4-2613a0c9e92b';

      await requestWithStaff
        .get(scheduleRoute + '/' + id)
        .expect(HttpStatus.OK);
    });

    // eslint-disable-next-line
    it('should not get schedule with id that does not exist', async() => {     
      const id = '9a52e495-a1ec-49e0-acb4-2613a0c9e92a'; //this id does not exist

      await requestWithStaff
        .get(scheduleRoute + '/' + id)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /:id', () => {
    // eslint-disable-next-line
    it('should update schedule', () => {});

    // eslint-disable-next-line
    it('should not update schedule with missing data', () => {});

    // eslint-disable-next-line
    it('should not update shedule when startTime is after endTime', () => {});

    // eslint-disable-next-line
    it('should not update schedule with id that does not exist', () => {});
  });

  describe('DELETE /:id', () => {
    // eslint-disable-next-line
    it('should delete schedule', () => {});

    // eslint-disable-next-line
    it('should delete schedule with id that does not exist', () => {});
  });
});
