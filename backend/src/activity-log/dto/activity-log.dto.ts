import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum ActionENUM {
  ADDED = 'ADDED',
  EDITED = 'EDITED',
  DELETED = 'DELETED',
  RESERVED = 'RESERVED',
  REGISTERED = 'REGISTERED',
}
export enum PriorityENUM {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  IMPORTANT = 'IMPORTANT',
}

export class ActivityLogDTO {
  @IsUUID()
  @IsString()
  @IsOptional()
  public id?: string;

  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsEnum(ActionENUM)
  @IsNotEmpty()
  public action: ActionENUM;

  @IsString()
  @IsNotEmpty()
  public entityName: string;

  @IsString()
  @IsOptional()
  public oldValue?: string;

  @IsString()
  @IsOptional()
  public newValue?: string;

  @IsDateString()
  @IsNotEmpty()
  public executedAt: Date;

  @IsEnum(PriorityENUM)
  @IsNotEmpty()
  public priority: PriorityENUM;
}
