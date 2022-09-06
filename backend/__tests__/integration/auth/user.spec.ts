import { HttpStatus } from '@nestjs/common';
import {
  testAdmin,
  testStaff,
} from '../../../src/global/test-data/user-test-data.service';
import { UserController } from '../../../src/user/user.controller';
import { requestWithAdmin, requestWithStaff } from '../setup';
import { Role } from '@prisma/client';
import { UserDTO } from '../../../src/user/dto/user.dto';

describe('user.spec.ts - User Controller', () => {
  const userRoute = UserController.USER_API_ROUTE;

  describe('GET /', () => {
    it('should get all users except self', async () => {
      const { body } = await requestWithAdmin
        .get(userRoute)
        .expect(HttpStatus.OK);

      const userIds = (body as UserDTO[]).map((user) => user.id);

      expect(userIds).not.toContain(testAdmin.id);
    });
  });

  describe('GET /:id', () => {
    it('should get user by id', async () => {
      const staffId = testStaff.id;
      const adminId = testAdmin.id;

      await requestWithStaff
        .get(userRoute + '/' + staffId)
        .expect(HttpStatus.OK);
      await requestWithAdmin
        .get(userRoute + '/' + adminId)
        .expect(HttpStatus.OK);
    });

    it('should not get user with id that does not exist', async () => {
      const staffId = '2f54ca0b-e389-4e17-a978-0cb98e0f7a47'; // this id does not exist
      const adminId = '2cf38670-0a8a-41e9-9018-e8b8a9b36487'; // this id does not exist

      await requestWithStaff
        .get(userRoute + '/' + staffId)
        .expect(HttpStatus.NOT_FOUND);
      await requestWithAdmin
        .get(userRoute + '/' + adminId)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /:id', () => {
    it('should update self', async () => {
      testStaff.name = 'test staff';
      testStaff.email = 'test_staff@teststaff.com';

      testAdmin.name = 'test admin';

      await requestWithStaff
        .put(userRoute + '/' + testStaff.id)
        .send(testStaff)
        .expect(HttpStatus.OK);
      await requestWithAdmin
        .put(userRoute + '/' + testAdmin.id)
        .send(testAdmin)
        .expect(HttpStatus.OK);
    });

    it("should not update self's roles", async () => {
      testStaff.roles = [Role.ORGANIZER];
      testAdmin.roles = [Role.ORGANIZER];

      await requestWithStaff
        .put(userRoute + '/' + testStaff.id)
        .send(testStaff.roles)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithAdmin
        .put(userRoute + '/' + testAdmin.id)
        .send(testAdmin.roles)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should update another user if admin', async () => {
      testStaff.name = 'test staff';

      await requestWithAdmin
        .put(userRoute + '/' + testStaff.id)
        .send(testStaff)
        .expect(HttpStatus.OK);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete user if admin', async () => {
      await requestWithAdmin
        .delete(userRoute + '/' + testStaff.id)
        .expect(HttpStatus.OK);
    });

    it('should not delete user if not admin', async () => {
      await requestWithStaff
        .delete(userRoute + '/' + testStaff.id)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should not delete user with id that does not exist', async () => {
      await requestWithAdmin
        .delete(userRoute + '/' + testStaff.id + 'random-characters')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
