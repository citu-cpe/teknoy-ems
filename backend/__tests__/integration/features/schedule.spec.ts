import { HttpStatus } from '@nestjs/common';
import { availableSchedule } from '../../../src/global/test-data/schedule-test-data.service';
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

  describe('POST /', () => {
    it('should create schedule', async () => {
      const { availability, startTime, endTime }: ScheduleDTO =
        await createSchedule(testCreateSchedule);

      expect(availability).toEqual(testCreateSchedule.availability);
      expect(startTime).toEqual(testCreateSchedule.startTime.toISOString());
      expect(endTime).toEqual(testCreateSchedule.endTime.toISOString());
    });

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
    it('should get schedule by id', async () => {
      const id = availableSchedule.id;

      await requestWithStaff
        .get(scheduleRoute + '/' + id)
        .expect(HttpStatus.OK);
    });

    it('should not get schedule with id that does not exist', async () => {
      const id = '9a52e495-a1ec-49e0-acb4-2613a0c9e92a'; //this id does not exist

      await requestWithStaff
        .get(scheduleRoute + '/' + id)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /:id', () => {
    it('should update schedule', () => {
      availableSchedule.startTime = new Date('2022-9-2 3:00:00 PM');
      availableSchedule.endTime = new Date('2022-9-2 5:00:00 PM');

      return requestWithStaff
        .put(scheduleRoute + '/' + availableSchedule.id)
        .send(availableSchedule)
        .expect(HttpStatus.OK);
    });

    it('should not update schedule with missing data', async () => {
      const updateWithNoStartTime = {
        id: availableSchedule.id,
        createdAt: availableSchedule.createdAt,
        updatedAt: new Date(),
        availability: availableSchedule.availability,
        endTime: new Date('2022-9-2 6:00:00 PM'),
      };
      const updateWithNoEndTime = {
        id: availableSchedule.id,
        createdAt: availableSchedule.createdAt,
        updatedAt: new Date(),
        availability: availableSchedule.availability,
        startTime: new Date('2022-9-2 3:00:00 PM'),
      };
      const updateWithNoStartAndEndTime = {
        id: availableSchedule.id,
        createdAt: availableSchedule.createdAt,
        updatedAt: new Date(),
        availability: availableSchedule.availability,
      };

      await requestWithStaff
        .put(scheduleRoute + '/' + availableSchedule.id)
        .send(updateWithNoStartTime)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .put(scheduleRoute + '/' + availableSchedule.id)
        .send(updateWithNoEndTime)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .put(scheduleRoute + '/' + availableSchedule.id)
        .send(updateWithNoStartAndEndTime)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update shedule when startTime is after endTime', () => {
      availableSchedule.startTime = new Date('2022-9-2 6:00:00 PM');
      availableSchedule.endTime = new Date('2022-9-2 5:00:00 PM');

      return requestWithStaff
        .put(scheduleRoute + '/' + availableSchedule.id)
        .send(availableSchedule)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not update schedule with id that does not exist', () => {
      const id = '9a52e495-a1ec-49e0-acb4-2613a0c9e92a'; //this id does not exist

      return requestWithStaff
        .put(scheduleRoute + '/' + id)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete schedule', () => {
      const id = availableSchedule.id;

      return requestWithStaff
        .delete(scheduleRoute + '/' + id)
        .expect(HttpStatus.OK);
    });

    it('should not delete schedule with id that does not exist', () => {
      const id = '9a52e495-a1ec-49e0-acb4-2613a0c9e92a'; //this id does not exist

      return requestWithStaff
        .put(scheduleRoute + '/' + id)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
