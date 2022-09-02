import { ScheduleController } from '../../../src/schedule/schedule.controller';

describe('schedule.spec.ts - Schedule Controller', () => {
  const scheduleRoute = ScheduleController.SCHEDULE_API_PATH;
  // eslint-disable-next-line
  const idPath = scheduleRoute + ScheduleController.ID_API_PATH;

  describe('POST /', () => {
    // eslint-disable-next-line
    it('should create schedule', () => {});

    // eslint-disable-next-line
    it('should not create schedule with missing data', () => {});

    // eslint-disable-next-line
    it('should not create schedule when startTime is after endTime', () => {});
  });

  describe('GET /', () => {
    // eslint-disable-next-line
    it('should get all schedules', () => {});
  });

  describe('GET /:id', () => {
    // eslint-disable-next-line
    it('should get schedule by id', () => {});

    // eslint-disable-next-line
    it('should not get schedule with id that does not exist', () => {});
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
