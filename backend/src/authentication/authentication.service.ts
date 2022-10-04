import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { EnvironmentVariableKeys } from '../shared/constants/environment-variable-keys';
import { TokenPayload } from './types/token-payload.interface';
import { User } from '@prisma/client';
import { PostgresErrorCode } from '../shared/constants/postgress-error-codes.enum';
import { TokensDTO } from './dto/tokens.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActionENUM, PriorityENUM } from '../activity-log/dto/activity-log.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  public async login(loginUserDTO: LoginUserDTO): Promise<LoginResponseDTO> {
    const user = await this.getAuthenticatedUser(
      loginUserDTO.email,
      loginUserDTO.password
    );

    if (user.isFirstLogin) {
      await this.userService.updateFirstLogin(user.id);
    }

    const accessToken = this.getJwtAccessToken(user.id);
    const refreshToken = this.getRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    const userDTO = UserService.convertToDTO(user);

    return {
      user: userDTO,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  public async register(
    user: User,
    registerUserDTO: RegisterUserDTO
  ): Promise<RegisterUserDTO> {
    const password = this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const registeredUser = await this.userService.register(
        registerUserDTO,
        hashedPassword
      );
      this.eventEmitter.emit('create.logs', {
        entityName: 'user',
        entityId: registeredUser.id,
        userId: user.id,
        newValue: JSON.stringify(registeredUser),
        action: ActionENUM.ADDED,
        priority: PriorityENUM.PRIVATE,
      });
      return {
        ...registerUserDTO,
        password,
      };
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(
          'User with that username or email already exists'
        );
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public logout(userId: string) {
    this.userService.deleteRefreshToken(userId);
  }

  public async refresh(refreshToken?: string): Promise<TokensDTO> {
    if (!refreshToken) {
      throw new UnauthorizedException({ invalidRefreshToken: true });
    }

    const payload = this.jwtService.decode(refreshToken) as TokenPayload;

    if (this.tokenExpired(payload.exp)) {
      throw new UnauthorizedException({ invalidRefreshToken: true });
    }

    const user = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId
    );

    const newAccessToken = this.getJwtAccessToken(user.id);
    const newRefreshToken = this.getRefreshToken(user.id);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string
  ): Promise<User> {
    const user = await this.userService.findByEmail(email);
    await this.verifyPassword(plainTextPassword, user.password);
    return user;
  }

  public getJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const secret = this.configService.get<string>(
      EnvironmentVariableKeys.JWT_ACCESS_TOKEN_SECRET
    );
    const expiresIn = this.configService.get<string>(
      EnvironmentVariableKeys.JWT_ACCESS_TOKEN_EXPIRATION_TIME
    );

    const token = this.jwtService.sign(payload, { secret, expiresIn });

    return token;
  }

  public getRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const secret = this.configService.get<string>(
      EnvironmentVariableKeys.JWT_REFRESH_TOKEN_SECRET
    );
    const expiresIn = this.configService.get<string>(
      EnvironmentVariableKeys.JWT_REFRESH_TOKEN_EXPIRATION_TIME
    );

    const token = this.jwtService.sign(payload, { secret, expiresIn });

    return token;
  }

  public async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  public tokenExpired(exp: number) {
    return Date.now() > exp * 1000;
  }

  private generateRandomPassword() {
    // https://stackoverflow.com/a/9719815
    return Math.random().toString(36).slice(-8);
  }
}
