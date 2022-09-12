import { venueTestCC } from '../../../src/global/test-data/venue-test-data.service';
import { VenueDTO } from '../../../src/venue/dto/venue.dto';
import { VenueController } from '../../../src/venue/venue.controller';
import { addVenue, testAddVenue } from '../fixtures/venue.fixtures';
import { requestWithStaff } from '../setup';
import { HttpStatus } from '@nestjs/common';
import { SortedVenuesDTO } from '../../../src/event/dto/sorted-venues.dto';
import { EventController } from '../../../src/event/event.controller';

describe('venue.spec.ts - Venue Controller', () => {
  const venueRoute = VenueController.VENUE_API_PATH;

  describe('POST /venue', () => {
    it('should successfully add a venue', async () => {
      const { name, notes }: VenueDTO = await addVenue(testAddVenue);

      expect(name).toEqual(testAddVenue.name);
      expect(notes).toEqual(testAddVenue.notes);
    });

    it('should successfully add a venue even if there is no notes', async () => {
      const venueWithoutNotes = {
        name: 'Canteen',
      };
      await requestWithStaff
        .post(venueRoute)
        .send(venueWithoutNotes)
        .expect(HttpStatus.CREATED);
    });

    it('should not successfully add a venue with the same name', async () => {
      const venueSameName = {
        name: 'Covered Court',
      };

      const { body } = await requestWithStaff
        .post(venueRoute)
        .send(venueSameName)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not successfully add a venue with missing data', async () => {
      const venueWithoutName = {
        notes: 'this is a test for covered court',
      };

      await requestWithStaff
        .post(venueRoute)
        .send(venueWithoutName)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /venue', () => {
    it('should get all venue', async () => {
      await requestWithStaff.get(venueRoute).expect(HttpStatus.OK);
    });
  });

  describe('GET /:id', () => {
    it('should get venue by id', async () => {
      await requestWithStaff
        .get(venueRoute + '/' + venueTestCC.id)
        .expect(HttpStatus.OK);
    });

    it('should not get venue with an id that does not exist', async () => {
      const id = '6ee07e9c-daa6-4d13-a96a-91a64d380a2e'; //this id does not exist
      await requestWithStaff.get(venueRoute + '/' + id).expect(HttpStatus.OK);
    });
  });

  describe('PUT /:id', () => {
    it('should update venue info', async () => {
      const updateVenueName = {
        name: 'Innovation Labs',
        notes: 'this is a test for covered court',
      };
      const updateVenueNotes = {
        name: 'Innovation Labs',
        notes: 'this is a test for innovation labs',
      };

      await requestWithStaff
        .put(venueRoute + '/' + venueTestCC.id)
        .send(updateVenueName)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(venueRoute + '/' + venueTestCC.id)
        .send(updateVenueNotes)
        .expect(HttpStatus.OK);
    });

    it('should not update venue info with an id that does not exist', async () => {
      const updateVenueWrongId = {
        id: '6ee07e9c-daa6-4d13-a96a-91a64d380a2f',
        name: 'Innovation Labs',
        notes: 'this is a test for covered court',
      };

      await requestWithStaff
        .put(venueRoute + '/' + updateVenueWrongId.id)
        .send(updateVenueWrongId)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a venue', async () => {
      await requestWithStaff
        .delete(venueRoute + '/' + venueTestCC.id)
        .expect(HttpStatus.OK);
    });

    it('should not delete a venue with id that does not exist', async () => {
      const id = '6ee07e9c-daa6-4d13-a96a-91a64d380a2f';
      await requestWithStaff
        .delete(venueRoute + '/' + id)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
