import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsUUID,
  Validate,
} from 'class-validator';
import { IsBeforeConstraint } from '../../shared/validators/is-before.validator';

export enum AvailabilityEnum {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export class ScheduleDTO {
  @IsUUID()
  @IsOptional()
  public id?: string;

  @IsEnum(AvailabilityEnum)
  public availability: AvailabilityEnum;

  @IsDateString()
  @Validate(IsBeforeConstraint, ['endTime'])
  public startTime: Date;

  @IsDateString()
  public endTime: Date;
}
