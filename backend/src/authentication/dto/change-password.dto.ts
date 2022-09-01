import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDTO {
  @IsNotEmpty()
  @IsString()
  public password: string;
}
