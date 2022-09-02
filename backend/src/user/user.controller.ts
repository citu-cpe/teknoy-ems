import { Role } from '.prisma/client';
import { Body, Controller, Delete, Get, Param, Put, Req } from '@nestjs/common';
import { RequestWithUser } from '../authentication/types/request-with-user.interface';
import { Roles } from '../authorization/decorators/roles.decorator';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller(UserController.USER_API_ROUTE)
export class UserController {
  public static USER_API_ROUTE = '/user';
  public static ID_API_ROUTE = '/:id';

  constructor(private readonly userService: UserService) {}

  @Get()
  public getUsers(): Promise<UserDTO[]> {
    return this.userService.getAllUsers();
  }

  @Get(UserController.ID_API_ROUTE)
  public getUserById(@Param('id') id: string): Promise<UserDTO> {
    return this.userService.getUserById(id);
  }

  @Put(UserController.ID_API_ROUTE)
  public editUser(
    @Req() { user }: RequestWithUser,
    @Param('id') id: string,
    @Body() userDTO: UserDTO
  ): Promise<UserDTO> {
    return this.userService.editUser(user, id, userDTO);
  }

  @Roles(Role.ADMIN)
  @Delete(UserController.ID_API_ROUTE)
  public deleteUser(@Param('id') id: string): Promise<UserDTO> {
    return this.userService.deleteUser(id);
  }
}
