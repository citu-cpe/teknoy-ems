import { HttpStatus } from '@nestjs/common';
import { ChangePasswordDTO } from 'src/authentication/dto/change-password.dto';
import { AuthenticationController } from '../../../src/authentication/authentication.controller';
import { LoginResponseDTO } from '../../../src/authentication/dto/login-response.dto';
import { LoginUserDTO } from '../../../src/authentication/dto/login-user.dto';
import {
  RegisterUserDTO,
  RoleEnum,
} from '../../../src/authentication/dto/register-user.dto';
import { TokensDTO } from '../../../src/authentication/dto/tokens.dto';
import { testStaff } from '../../../src/global/test-data/user-test-data.service';
import {
  logIn,
  registerUser,
  testRegisterUser,
} from '../fixtures/auth.fixtures';
import { request, requestWithAdmin, requestWithStaff } from '../setup';

describe('auth.spec.ts - Authentication Controller', () => {
  let loginRoute: string;
  let registerRoute: string;
  let logoutRoute: string;
  let refreshRoute: string;
  let changePasswordRoute: string;

  beforeAll(() => {
    const authRoute = AuthenticationController.AUTH_API_ROUTE;
    loginRoute = authRoute + AuthenticationController.LOGIN_API_ROUTE;
    registerRoute = authRoute + AuthenticationController.REGISTER_API_ROUTE;
    logoutRoute = authRoute + AuthenticationController.LOGOUT_API_ROUTE;
    refreshRoute = authRoute + AuthenticationController.REFRESH_API_ROUTE;
    changePasswordRoute =
      authRoute + AuthenticationController.CHANGE_PASSWORD_API_ROUTE;
  });

  describe('POST /login', () => {
    it('should log in successfully', async () => {
      const loginUserDTO: LoginUserDTO = {
        email: 'test_staff@test.com',
        password: 'test',
      };

      const { body } = await request
        .post(loginRoute)
        .send(loginUserDTO)
        .expect(HttpStatus.OK);
      const { user, tokens } = body as LoginResponseDTO;

      expect(user.email).toBe(loginUserDTO.email);
      expect(tokens.accessToken).toBeTruthy();
      expect(tokens.refreshToken).toBeTruthy();
    });

    it('should throw bad request exception when data is invalid', async () => {
      const loginUserDTOWithoutEmail = {
        password: 'mock',
      };
      const loginUserDTOWithoutPassword = {
        email: 'mock@mock.com',
      };
      const loginUserDTOWithInvalidEmail: LoginUserDTO = {
        email: 'not an email',
        password: 'mock',
      };

      await request.post(loginRoute).expect(HttpStatus.BAD_REQUEST);
      await request
        .post(loginRoute)
        .send(loginUserDTOWithoutEmail)
        .expect(HttpStatus.BAD_REQUEST);
      await request
        .post(loginRoute)
        .send(loginUserDTOWithoutPassword)
        .expect(HttpStatus.BAD_REQUEST);
      await request
        .post(loginRoute)
        .send(loginUserDTOWithInvalidEmail)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /register', () => {
    it('should successfully register when name, email, and password are provided', async () => {
      const { email, name, password, roles }: RegisterUserDTO =
        await registerUser(testRegisterUser);

      expect(email).toEqual(testRegisterUser.email);
      expect(name).toEqual(testRegisterUser.name);
      expect(roles).toEqual(testRegisterUser.roles);
      expect(password).toBeTruthy();
    });

    it('should not be able to register user when user is not an admin', async () => {
      await requestWithStaff
        .post(registerRoute)
        .send(testRegisterUser)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should throw bad request exception when data is invalid', async () => {
      const registerUserDTOWithoutName = {
        email: 'mock@mock.com',
        password: ' mock',
      };
      const registerUserDTOWithoutEmail = {
        name: 'mock',
        password: 'mock',
      };
      const registerUserDTOWithoutPassword = {
        name: 'mock',
        email: 'mock@mock.com',
      };
      const registerUserDTOWithInvalidEmail: RegisterUserDTO = {
        name: 'mock',
        email: 'not an email',
        password: 'mock',
        roles: [RoleEnum.STAFF],
      };
      const registerUserDTOWithInvalidRole = {
        name: 'mock',
        email: 'not an email',
        password: 'mock',
        roles: ['NOT_A_VALID_ROLE'],
      };

      await requestWithAdmin.post(registerRoute).expect(HttpStatus.BAD_REQUEST);
      await requestWithAdmin
        .post(registerRoute)
        .send(registerUserDTOWithoutName)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithAdmin
        .post(registerRoute)
        .send(registerUserDTOWithoutEmail)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithAdmin
        .post(registerRoute)
        .send(registerUserDTOWithoutPassword)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithAdmin
        .post(registerRoute)
        .send(registerUserDTOWithInvalidEmail)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithAdmin
        .post(registerRoute)
        .send(registerUserDTOWithInvalidRole)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /logout', () => {
    it('should successfully log out when user is sent', async () => {
      const { user } = await logIn();

      await request.post(logoutRoute).send(user).expect(HttpStatus.OK);
    });

    it('should not log out without sending user', async () => {
      await request.post(logoutRoute).expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /refresh', () => {
    it('should refresh access token', async () => {
      const { tokens } = await logIn();

      const { body } = await request
        .post(refreshRoute)
        .send(tokens)
        .expect(HttpStatus.OK);
      const { accessToken, refreshToken } = body as TokensDTO;

      expect(accessToken).toBeTruthy();
      expect(refreshToken).toBeTruthy();
    });

    it('should not refresh access token when no refresh token is sent', async () => {
      await request.post(refreshRoute).expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /change-password', () => {
    it('should successfully change password', async () => {
      const changePasswordDTO: ChangePasswordDTO = {
        currentPassword: testStaff.password,
        newPassword: 'new_password',
      };

      // change password
      await requestWithStaff
        .put(changePasswordRoute)
        .send(changePasswordDTO)
        .expect(HttpStatus.OK);

      const loginUserDTO: LoginUserDTO = {
        email: 'test_staff@test.com',
        password: 'new_password',
      };

      // log in with new password
      const { body } = await request
        .post(loginRoute)
        .send(loginUserDTO)
        .expect(HttpStatus.OK);
      const { user, tokens } = body as LoginResponseDTO;

      expect(user.email).toBe(loginUserDTO.email);
      expect(tokens.accessToken).toBeTruthy();
      expect(tokens.refreshToken).toBeTruthy();
    });

    it('should not successfully change password when not authenticated', async () => {
      await request.put(changePasswordRoute).expect(HttpStatus.UNAUTHORIZED);
    });

    it('should not successfully change password with wrong data', async () => {
      const changePasswordDTO: ChangePasswordDTO = {
        currentPassword: 'notmypassword',
        newPassword: 'new_password',
      };

      // change password
      await requestWithStaff
        .put(changePasswordRoute)
        .send(changePasswordDTO)
        .expect(HttpStatus.BAD_REQUEST);

      await requestWithStaff
        .put(changePasswordRoute)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
