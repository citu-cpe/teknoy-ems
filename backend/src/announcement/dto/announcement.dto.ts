import {
  IsArray,
  IsEnum,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum ViewAccessENUM {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
export class AnnouncementDTO {
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
  public title: string;

  @IsString()
  @IsOptional()
  public subtitle?: string;

  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsArray()
  @IsNotEmpty()
  public tags: string[];

  @IsEnum(ViewAccessENUM)
  @IsNotEmpty()
  public viewAccess: ViewAccessENUM;
}
