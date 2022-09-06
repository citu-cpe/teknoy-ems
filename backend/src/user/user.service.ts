import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDTO } from '../authentication/dto/register-user.dto';
import bcrypt from 'bcrypt';
import { PrismaService } from '../global/prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { UserDTO } from './dto/user.dto';
import { ChangePasswordDTO } from 'src/authentication/dto/change-password.dto';
import { arraysEqual } from '../shared/utils/array.util';
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAllUsers(user: User): Promise<UserDTO[]> {
    const users = await this.prismaService.user.findMany({
      where: { id: { not: user.id } },
    });

    return users.map((u) => UserService.convertToDTO(u));
  }

  public async getUserById(id: string): Promise<UserDTO> {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { id },
      });

      return UserService.convertToDTO(user);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public async editUser(
    loggedInUserDTO: UserDTO,
    id: string,
    userDTO: UserDTO
  ): Promise<UserDTO> {
    const isAdmin = loggedInUserDTO.roles.includes(Role.ADMIN);
    const isSelf = loggedInUserDTO.id === userDTO.id;

    if (!isSelf && !isAdmin) {
      throw new ForbiddenException('You are not allowed to edit this user');
    }

    if (isSelf && !isAdmin) {
      const loggedInUser = await this.prismaService.user.findUnique({
        where: { id: loggedInUserDTO.id },
      });

      if (!arraysEqual(loggedInUser.roles, userDTO.roles)) {
        throw new ForbiddenException(
          'You are not allowed to edit your own roles'
        );
      }
    }

    try {
      const user = await this.prismaService.user.update({
        data: userDTO,
        where: { id },
      });

      return UserService.convertToDTO(user);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public async deleteUser(id: string): Promise<UserDTO> {
    try {
      const user = await this.prismaService.user.delete({ where: { id } });

      return UserService.convertToDTO(user);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
    }
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this email does not exist');
  }

  public async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this id does not exist');
  }

  public async register(
    data: RegisterUserDTO,
    password: string
  ): Promise<User> {
    return this.prismaService.user.create({ data: { ...data, password } });
  }

  public async setCurrentRefreshToken(
    refreshToken: string,
    userId: string
  ): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prismaService.user.update({
      data: { currentHashedRefreshToken },
      where: { id: userId },
    });
  }

  public async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string
  ): Promise<User> {
    const user = await this.findById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  public async deleteRefreshToken(userId: string): Promise<User> {
    return this.prismaService.user.update({
      data: { currentHashedRefreshToken: null },
      where: { id: userId },
    });
  }

  public async changePassword(
    user: User,
    changePasswordDTO: ChangePasswordDTO
  ): Promise<UserDTO> {
    const isPasswordMatching = await bcrypt.compare(
      changePasswordDTO.currentPassword,
      user.password
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }

    try {
      const hashedPassword = await bcrypt.hash(
        changePasswordDTO.newPassword,
        10
      );
      const updatedUser = await this.prismaService.user.update({
        data: { password: hashedPassword },
        where: { id: user.id },
      });

      return UserService.convertToDTO(updatedUser);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public async updateFirstLogin(userId: string): Promise<User> {
    try {
      return this.prismaService.user.update({
        data: { isFirstLogin: false },
        where: { id: userId },
      });
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public static convertToDTO(user: User): UserDTO {
    const { id, createdAt, updatedAt, email, name, roles, isFirstLogin } = user;

    const userDTO: UserDTO = {
      id,
      createdAt,
      updatedAt,
      email,
      name,
      roles,
      isFirstLogin,
    };

    return userDTO;
  }
}
