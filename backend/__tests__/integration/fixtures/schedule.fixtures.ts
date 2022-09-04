import { HttpStatus } from '@nestjs/common';
import { AuthenticationController } from '../../../src/authentication/authentication.controller';
import {
  AvailabilityEnum,
  ScheduleDTO,
} from '../../../src/schedule/dto/schedule.dto';

import { ScheduleController } from '../../../src/schedule/schedule.controller';
import { request, requestWithAdmin, requestWithStaff } from '../setup';

const scheduleRoute = ScheduleController.SCHEDULE_API_PATH;

export const testCreateSchedule: ScheduleDTO = {
  availability: AvailabilityEnum.AVAILABLE,
  startTime: new Date('2022-9-2 2:00:00 PM'),
  endTime: new Date('2022-9-2 5:00:00 PM'),
};

export const createSchedule = async (
  dto: ScheduleDTO
): Promise<ScheduleDTO> => {
  const { body } = await requestWithStaff
    .post(scheduleRoute)
    .send(dto)
    .expect(HttpStatus.CREATED);

  return body;
};
