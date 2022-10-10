import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  public newPassword: string;

  @IsString()
  @IsNotEmpty()
  public token: string;
}
