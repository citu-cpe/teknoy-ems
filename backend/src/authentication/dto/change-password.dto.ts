import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDTO {
  @IsNotEmpty()
  @IsString()
  public currentPassword: string;

  @IsNotEmpty()
  @IsString()
  public newPassword: string;
}
