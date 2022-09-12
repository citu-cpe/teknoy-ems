import { Role, User } from '@prisma/client';
import { LoginUserDTO } from '../../../src/authentication/dto/login-user.dto';
import {
  RegisterUserDTO,
  RoleEnum,
} from '../../../src/authentication/dto/register-user.dto';
import { HttpStatus } from '@nestjs/common';
import { LoginResponseDTO } from '../../../src/authentication/dto/login-response.dto';
import { AuthenticationController } from '../../../src/authentication/authentication.controller';
import { request, requestWithAdmin } from '../setup';

const authRoute = AuthenticationController.AUTH_API_ROUTE;
const registerRoute = authRoute + AuthenticationController.REGISTER_API_ROUTE;
const loginRoute = authRoute + AuthenticationController.LOGIN_API_ROUTE;

export const testRegisterUser: RegisterUserDTO = {
  name: 'test_register',
  email: 'test_register@test.com',
  roles: [RoleEnum.STAFF],
};

export const createUser = async (
  user: LoginUserDTO | RegisterUserDTO
): Promise<User> => {
  const newUser: User = {
    id: '',
    email: user.email,
    name: 'test_user',
    createdAt: new Date(),
    updatedAt: new Date(),
    password: generateRandomPassword(),
    currentHashedRefreshToken: null,
    roles: [Role.STAFF],
    isFirstLogin: true,
  };

  if (user instanceof RegisterUserDTO) {
    newUser.name = user.name;
  }

  return newUser;
};

export const registerUser = async (
  dto: RegisterUserDTO
): Promise<RegisterUserDTO> => {
  const { body } = await requestWithAdmin
    .post(registerRoute)
    .send(dto)
    .expect(HttpStatus.CREATED);

  return body;
};

export const logIn = async (): Promise<LoginResponseDTO> => {
  const loginUserDTO: LoginUserDTO = {
    email: 'test_staff@test.com',
    password: 'test',
  };

  const { body } = await request
    .post(loginRoute)
    .send(loginUserDTO)
    .expect(HttpStatus.OK);

  return body as LoginResponseDTO;
};

const generateRandomPassword = () => {
  // https://stackoverflow.com/a/9719815
  return Math.random().toString(36).slice(-8);
};
