import {
  IsEnum,
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

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsEnum(TypeEnum)
  public type: TypeEnum;
}
