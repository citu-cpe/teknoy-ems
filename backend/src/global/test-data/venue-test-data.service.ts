import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/prisma/prisma.service';
import { CustomLogger } from '../../shared/custom-logger';
import { Venues } from '@prisma/client';

export const venueTestCC: Venues = {
  id: '6ee07e9c-daa6-4d13-a96a-91a64d380a2e',
  name: 'Covered Court',
  notes: 'this is a test for covered court',
};
export const venueTestGYM: Venues = {
  id: '9c519856-a674-4ae4-9cc3-92223fb09422',
  name: 'GYM',
  notes: 'this is a test for GYM',
};

@Injectable()
export class VenueTestDataService {
  private readonly logger = new CustomLogger(VenueTestDataService.name);
  constructor(private readonly prisma: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING VENUE TEST DATA');
    const findDepartmentOrganizer = await this.prisma.venues.findUnique({
      where: {
        id: venueTestCC.id,
      },
    });
    const findOrganizationOrganizer = await this.prisma.venues.findUnique({
      where: {
        id: venueTestGYM.id,
      },
    });

    if (!findDepartmentOrganizer) {
      await this.createVenue(venueTestCC);
    }
    if (!findOrganizationOrganizer) {
      await this.createVenue(venueTestGYM);
    }
  }
  private async createVenue(data: Venues) {
    await this.prisma.venues.create({ data });
  }
}
