import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { UserDTO } from '../user/dto/user.dto';
import { Public } from '../shared/decorators/public.decorator';
import { TokensDTO } from './dto/tokens.dto';
import { RequestWithUser } from './types/request-with-user.interface';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { UserService } from '../user/user.service';
import { Role } from '@prisma/client';
import { Roles } from '../authorization/decorators/roles.decorator';

@Controller(AuthenticationController.AUTH_API_ROUTE)
export class AuthenticationController {
  public static readonly AUTH_API_ROUTE = '/auth';
  public static readonly REGISTER_API_ROUTE = '/register';
  public static readonly LOGIN_API_ROUTE = '/login';
  public static readonly LOGOUT_API_ROUTE = '/logout';
  public static readonly REFRESH_API_ROUTE = '/refresh';
  public static readonly CHANGE_PASSWORD_API_ROUTE = '/change-password';

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService
  ) {}

  @Roles(Role.ADMIN)
  @Post(AuthenticationController.REGISTER_API_ROUTE)
  public register(
    @Req() { user }: RequestWithUser,
    @Body() registerUserDTO: RegisterUserDTO
  ): Promise<RegisterUserDTO> {
    return this.authenticationService.register(user, registerUserDTO);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post(AuthenticationController.LOGIN_API_ROUTE)
  public logIn(@Body() loginUserDTO: LoginUserDTO): Promise<LoginResponseDTO> {
    return this.authenticationService.login(loginUserDTO);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post(AuthenticationController.LOGOUT_API_ROUTE)
  public logOut(@Body() user: UserDTO): void {
    this.authenticationService.logout(user.id);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post(AuthenticationController.REFRESH_API_ROUTE)
  public refresh(@Body() { refreshToken }: TokensDTO): Promise<TokensDTO> {
    return this.authenticationService.refresh(refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @Put(AuthenticationController.CHANGE_PASSWORD_API_ROUTE)
  public changePassword(
    @Req() { user }: RequestWithUser,
    @Body() changePasswordDTO: ChangePasswordDTO
  ): Promise<UserDTO> {
    return this.userService.changePassword(user, changePasswordDTO);
  }
}
