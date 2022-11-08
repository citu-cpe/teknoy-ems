import { VenueController } from '../../../src/venue/venue.controller';
import { VenueDTO } from '../../../src/venue/dto/venue.dto';
import { requestWithStaff } from '../setup';
import { HttpStatus } from '@nestjs/common';

const venueRoute = VenueController.VENUE_API_PATH;

export const testAddVenue: VenueDTO = {
  name: 'Canteen',
  notes: 'this is a test for canteen',
};

export const addVenue = async (dto: VenueDTO): Promise<VenueDTO> => {
  const { body } = await requestWithStaff
    .post(venueRoute)
    .send(dto)
    .expect(HttpStatus.CREATED);

  return body;
};

