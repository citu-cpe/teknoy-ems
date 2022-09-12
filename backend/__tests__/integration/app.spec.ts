import { HttpStatus } from '@nestjs/common';
import { AppController } from '../../src/app.controller';
import { request, requestWithAdmin, requestWithStaff } from './setup';

describe('app.spec.ts - App Controller', () => {
  describe('GET /', () => {
    it('should respond with Hello World!', () => {
      return request.get('/').expect(HttpStatus.OK).expect('Hello World!');
    });
  });

  describe('GET /authorization-test', () => {
    it('should authorize user if user is admin', async () => {
      await requestWithAdmin
        .get(AppController.API_PATH_AUTHORIZATION_TEST)
        .expect(HttpStatus.OK);
    });

    it('should not authorize if user is not admin', async () => {
      await requestWithStaff
        .get(AppController.API_PATH_AUTHORIZATION_TEST)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
