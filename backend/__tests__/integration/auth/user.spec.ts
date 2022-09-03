import { UserController } from '../../../src/user/user.controller';

xdescribe('user.spec.ts - User Controller', () => {
  const userRoute = UserController.USER_API_ROUTE;
  // eslint-disable-next-line
  const idPath = userRoute + UserController.ID_API_ROUTE;

  describe('GET /', () => {
    // eslint-disable-next-line
    it('should get all user', () => {});
  });

  describe('GET /:id', () => {
    // eslint-disable-next-line
    it('should get user by id', () => {});

    // eslint-disable-next-line
    it('should not get user with id that does not exist', () => {});
  });

  describe('PUT /:id', () => {
    // eslint-disable-next-line
    it('should update self', () => {});

    // eslint-disable-next-line
    it("should not update self's roles", () => {});

    // eslint-disable-next-line
    it('should update another user if admin', () => {});
  });

  describe('DELETE /:id', () => {
    // eslint-disable-next-line
    it('should delete user if admin', () => {});

    // eslint-disable-next-line
    it('should not delete user if not admin', () => {});
  });
});
