import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordLinkDTO {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}
