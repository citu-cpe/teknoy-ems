import {
  IsEnum,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum TypeEnum {
  DEPARTMENT = 'DEPARTMENT',
  ORGANIZATION = 'ORGANIZATION',
  OTHERS = 'OTHERS',
}

export class OrganizerDTO {
  @IsUUID()
  @IsOptional()
  public id?: string;

  @IsDateString()
  @IsOptional()
  public createdAt?: Date;

  @IsDateString()
  @IsOptional()
  public updatedAt?: Date;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsEnum(TypeEnum)
  public type: TypeEnum;
}
