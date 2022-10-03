import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UserDTO } from '../../user/dto/user.dto';

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
  @IsNotEmpty()
  public id: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  public userId: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  public user: UserDTO;

  @IsEnum(ActionENUM)
  @IsNotEmpty()
  public action: ActionENUM;

  @IsNotEmpty()
  @IsString()
  public entityName: string;

  @IsUUID()
  @IsNotEmpty()
  public entityId: string;

  @IsString()
  @IsOptional()
  public oldValue?: string;

  @IsString()
  @IsOptional()
  public newValue?: string;

  @IsDateString()
  @IsNotEmpty()
  public executedAt: Date;

  @IsDateString()
  @IsNotEmpty()
  public createdAt: Date;

  @IsDateString()
  @IsOptional()
  public updatedAt?: Date;

  @IsEnum(PriorityENUM)
  @IsNotEmpty()
  public priority: PriorityENUM;
}
