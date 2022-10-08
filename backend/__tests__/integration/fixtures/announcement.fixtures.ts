import { AnnouncementController } from '../../../src/announcement/announcement.controller';
import {
  AnnouncementDTO,
  ViewAccessENUM,
} from '../../../src/announcement/dto/announcement.dto';
import { HttpStatus } from '@nestjs/common';
import { requestWithStaff } from '../setup';
import { TEST_DATA_PREFIX } from '../../../src/shared/constants/test-data-prefix';

const announcementRoute = AnnouncementController.ANNOUNCEMENT_API_ROUTE;

export const testCreateAnnouncement: AnnouncementDTO = {
  title: TEST_DATA_PREFIX + 'NEW ANNOUNCEMENT',
  subtitle: 'SUBTITLE',
  content: 'this is a content',
  tags: ['tag1', 'tag2'],
  viewAccess: ViewAccessENUM.PRIVATE,
};

export const createAnnouncement = async (
  dto: AnnouncementDTO
): Promise<AnnouncementDTO> => {
  const { body } = await requestWithStaff
    .post(announcementRoute)
    .send(dto)
    .expect(HttpStatus.CREATED);

  return body;
};
