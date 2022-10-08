import { Injectable } from '@nestjs/common';
import { Announcement, ViewAccess } from '@prisma/client';
import { PrismaService } from '../../global/prisma/prisma.service';
import { TEST_DATA_PREFIX } from '../../shared/constants/test-data-prefix';
import { CustomLogger } from '../../shared/custom-logger';

export const addAnnouncement: Announcement = {
  id: 'f3666617-01ec-4f7f-8bd9-6d337268c30a',
  createdAt: new Date(),
  updatedAt: new Date(),
  title: TEST_DATA_PREFIX + 'NEW ANNOUNCEMENT',
  subtitle: 'SUBTITLE',
  content: 'this is a content',
  tags: ['tag1', 'tag2'],
  viewAccess: ViewAccess.PRIVATE,
};

@Injectable()
export class AnnouncementTestDataService {
  private readonly logger = new CustomLogger(AnnouncementTestDataService.name);
  constructor(private readonly prisma: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING EQUIPMENT TEST DATA');
    const findAnnouncement = await this.prisma.announcement.findUnique({
      where: {
        id: addAnnouncement.id,
      },
    });
    if (!findAnnouncement) {
      this.logger.log('GENERATING EQUIPMENT TEST DATA');
      await this.createAnnouncement(addAnnouncement);
    }
  }
  private async createAnnouncement(data: Announcement) {
    await this.prisma.announcement.create({ data });
  }
}
