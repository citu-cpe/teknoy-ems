import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum RoleEnum {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  ORGANIZER = 'ORGANIZER',
}

export class RegisterUserDTO {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsArray()
  @IsEnum(RoleEnum, { each: true })
  public roles: RoleEnum[];

  @IsString()
  @IsOptional()
  @MinLength(4)
  public password?: string;
}
