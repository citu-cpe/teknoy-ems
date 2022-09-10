import { HttpStatus } from '@nestjs/common';
import { EventController } from '../../../src/event/event.controller';
import { requestWithStaff } from '../setup';

describe('event.spec.ts - Event Controller', () => {
  const eventApiPath = EventController.EVENT_API_PATH;

  it('should get all events', async () => {
    await requestWithStaff.get(eventApiPath).expect(HttpStatus.OK);
  });
});
