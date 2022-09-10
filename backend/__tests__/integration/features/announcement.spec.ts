import { AnnouncementDTO } from '../../../src/announcement/dto/announcement.dto';
import { AnnouncementController } from '../../../src/announcement/announcement.controller';
import { addAnnouncement } from '../../../src/global/test-data/announcement-test-data.service';
import {
  createAnnouncement,
  testCreateAnnouncement,
} from '../fixtures/announcement.fixtures';
import { requestWithStaff } from '../setup';
import { HttpStatus } from '@nestjs/common';
import { ViewAccessEnum } from '../../../src/event/dto/event-create.dto';

describe('announcement.spec.ts - Announcement Controller', () => {
  const announcementRoute = AnnouncementController.ANNOUNCEMENT_API_ROUTE;

  describe('POST /announcement', () => {
    it('should successfully create an announcement', async () => {
      const { title, subtitle, content, tags, viewAccess }: AnnouncementDTO =
        await createAnnouncement(testCreateAnnouncement);

      expect(title).toEqual(addAnnouncement.title);
      expect(subtitle).toEqual(addAnnouncement.subtitle);
      expect(content).toEqual(addAnnouncement.content);
      expect(tags).toEqual(addAnnouncement.tags);
      expect(viewAccess).toEqual(addAnnouncement.viewAccess);
    });

    it('should successfully create an announcement even if subtitle is missing', async () => {
      //subtitle is not required so it should still succesfully create an announcement
      const announcementWithoutSubtitle = {
        title: 'NEW ANNOUNCEMENT',
        content: 'this is a content',
        tags: ['tag1', 'tag2'],
        viewAccess: ViewAccessEnum.PRIVATE,
      };

      await requestWithStaff
        .post(announcementRoute)
        .send(announcementWithoutSubtitle)
        .expect(HttpStatus.CREATED);
    });

    it('should not successfully create an announcement with missing data', async () => {
      const announcementWithoutTitle = {
        subtitle: 'SUBTITLE',
        content: 'this is a content',
        tags: ['tag1', 'tag2'],
        viewAccess: ViewAccessEnum.PRIVATE,
      };
      const announcementWithoutContent = {
        title: 'NEW ANNOUNCEMENT',
        subtitle: 'SUBTITLE',
        tags: ['tag1', 'tag2'],
        viewAccess: ViewAccessEnum.PRIVATE,
      };
      const announcementWithoutTags = {
        title: 'NEW ANNOUNCEMENT',
        subtitle: 'SUBTITLE',
        content: 'this is a content',
        viewAccess: ViewAccessEnum.PRIVATE,
      };
      const announcementWithoutViewAccess = {
        title: 'NEW ANNOUNCEMENT',
        subtitle: 'SUBTITLE',
        content: 'this is a content',
        tags: ['tag1', 'tag2'],
      };

      await requestWithStaff
        .post(announcementRoute)
        .send(announcementWithoutTitle)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(announcementRoute)
        .send(announcementWithoutContent)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(announcementRoute)
        .send(announcementWithoutTags)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(announcementRoute)
        .send(announcementWithoutViewAccess)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /announcement', () => {
    it('should get all announcement', async () => {
      await requestWithStaff.get(announcementRoute).expect(HttpStatus.OK);
    });
  });

  describe('GET /:id', () => {
    it('should get an announcement by id', async () => {
      await requestWithStaff
        .get(announcementRoute + '/' + addAnnouncement.id)
        .expect(HttpStatus.OK);
    });

    it('should not get an announcement with an id that does not exist', async () => {
      const id = 'f3666617-01ec-4f7f-8bd9-6d337268c30ab'; //this id does not exist
      await requestWithStaff
        .get(announcementRoute + '/' + id)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /:id', () => {
    it('should update announcement info', async () => {
      const updateAnnouncementTitle = {
        id: addAnnouncement.id,
        title: 'Updated Title',
        subtitle: addAnnouncement.subtitle,
        content: addAnnouncement.content,
        tags: addAnnouncement.tags,
        viewAccess: addAnnouncement.viewAccess,
      };
      const updateAnnouncementSubtitle = {
        id: addAnnouncement.id,
        title: addAnnouncement.title,
        subtitle: 'Updated Subtitle',
        content: addAnnouncement.content,
        tags: addAnnouncement.tags,
        viewAccess: addAnnouncement.viewAccess,
      };
      const updateAnnouncementContent = {
        id: addAnnouncement.id,
        title: addAnnouncement.title,
        subtitle: addAnnouncement.subtitle,
        content: 'Updated Content',
        tags: addAnnouncement.tags,
        viewAccess: addAnnouncement.viewAccess,
      };
      const updateAnnouncementTags = {
        id: addAnnouncement.id,
        title: addAnnouncement.title,
        subtitle: addAnnouncement.subtitle,
        content: addAnnouncement.content,
        tags: ['tag 3'],
        viewAccess: addAnnouncement.viewAccess,
      };
      const updateAnnouncementViewAccess = {
        id: addAnnouncement.id,
        title: addAnnouncement.title,
        subtitle: addAnnouncement.subtitle,
        content: addAnnouncement.content,
        tags: addAnnouncement.tags,
        viewAccess: ViewAccessEnum.PUBLIC,
      };

      await requestWithStaff
        .put(announcementRoute + '/' + addAnnouncement.id)
        .send(updateAnnouncementTitle)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(announcementRoute + '/' + addAnnouncement.id)
        .send(updateAnnouncementSubtitle)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(announcementRoute + '/' + addAnnouncement.id)
        .send(updateAnnouncementContent)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(announcementRoute + '/' + addAnnouncement.id)
        .send(updateAnnouncementTags)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(announcementRoute + '/' + addAnnouncement.id)
        .send(updateAnnouncementViewAccess)
        .expect(HttpStatus.OK);
    });

    it('should not update an announcement with an id that does not exist', async () => {
      const updateAnnouncementTags = {
        id: 'f3666617-01ec-4f7f-8bd9-6d337268c30ab', //this id does not exist
        title: addAnnouncement.title,
        subtitle: addAnnouncement.subtitle,
        content: addAnnouncement.content,
        tags: ['tag 3'],
        viewAccess: addAnnouncement.viewAccess,
      };
      await requestWithStaff
        .put(announcementRoute + '/' + updateAnnouncementTags.id)
        .send(updateAnnouncementTags)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete an announcement', async () => {
      await requestWithStaff
        .delete(announcementRoute + '/' + addAnnouncement.id)
        .expect(HttpStatus.OK);
    });

    it('should not delete an announcement with an id that does not exist', async () => {
      const id = 'f3666617-01ec-4f7f-8bd9-6d337268c30ab'; //this id does not exist

      await requestWithStaff
        .delete(announcementRoute + '/' + id)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
