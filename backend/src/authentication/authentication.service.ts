import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { PrismaService } from '../global/prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { ResetPasswordLinkDTO } from './dto/reset-password-link.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly prismaService: PrismaService
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

      // not awaiting beause it causes socket hangup console.error
      // it also just takes too long
      this.sendEmail(
        registerUserDTO.email,
        'Login credentials',
        `
        <h1>Login credentials</h1>
        <p>Email: ${registerUserDTO.email}</p>
        <p>Password: ${password}</p>
        `
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

  public async sendResetPasswordLink(dto: ResetPasswordLinkDTO): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // we don't throw an error if the user does not exist for security reasons
      // (so that a hacker can't tell if the email was valid or not)
      return;
    }

    const secret = this.configService.get<string>(
      EnvironmentVariableKeys.JWT_ACCESS_TOKEN_SECRET
    );

    const token = this.jwtService.sign(
      { userId: user.id },
      { secret, expiresIn: 600 }
    );

    await this.prismaService.passwordResetTokens.create({
      data: { userId: user.id, token },
    });

    const frontendUrl = this.configService.get<string>(
      EnvironmentVariableKeys.FRONTEND_URL
    );

    const resetPasswordLink = frontendUrl + '/reset-password?token=' + token;

    await this.sendEmail(
      dto.email,
      'Password reset',
      `
        <h1>Reset password</h1>
        <p>Reset password link: <a href="${resetPasswordLink}">${resetPasswordLink}</a></p>
        <em>Note: this password reset link is only valid for 10 minutes</em>
      `
    );
  }

  private async sendEmail(
    toEmail: string,
    subject: string,
    html: string
  ): Promise<void> {
    const emailUsername = this.configService.get<string>(
      EnvironmentVariableKeys.EMAIL_USERNAME
    );
    const emailPassword = this.configService.get<string>(
      EnvironmentVariableKeys.EMAIL_PASSWORD
    );

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUsername,
        pass: emailPassword,
      },
    });

    await transporter.sendMail({
      from: '"Teknoy Events Management System" <teampnrn@gmail.com>',
      to: [toEmail],
      subject,
      html,
    });
  }

  public async resetPassword(dto: ResetPasswordDTO): Promise<void> {
    try {
      const passwordResetToken =
        await this.prismaService.passwordResetTokens.findUniqueOrThrow({
          where: { token: dto.token },
        });

      const payload = this.jwtService.decode(
        passwordResetToken.token
      ) as TokenPayload;

      if (this.tokenExpired(payload.exp)) {
        throw new BadRequestException('This reset link has expired');
      }

      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { id: payload.userId },
      });

      await this.userService.changePassword(user, dto.newPassword);
    } catch (e) {
      if (e) {
        if (e instanceof NotFoundError) {
          throw new NotFoundException();
        }
      }
    }
  }
}
