import {
  IsUUID,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  Validate,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { IsBeforeConstraint } from '../../shared/validators/is-before.validator';

export enum StatusEnum {
  PENDING = 'PENDING',
  ONGOING = 'ONGOING',
  RESERVED = 'RESERVED',
  DONE = 'DONE',
  CANCELED = 'CANCELED',
  POSTPONED = 'POSTPONED',
}

export enum ViewAccessEnum {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum EventTypeEnum {
  CORPORATE = 'CORPORATE',
  ACADEMIC = 'ACADEMIC',
  SEMINAR = 'SEMINAR',
  CONFERENCE = 'CONFERENCE',
  CAMPUS_WIDE = 'CAMPUS_WIDE',
  VIRTUAL = 'VIRTUAL',
  SPORTS = 'SPORTS',
  OTHERS = 'OTHERS',
}

export class EventCreateDTO {
  @IsUUID()
  @IsOptional()
  public id?: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  public description?: string;

  @IsNotEmpty()
  @IsEnum(StatusEnum)
  public status: StatusEnum;

  @IsDateString()
  @Validate(IsBeforeConstraint, ['endTime'])
  public startTime: Date;

  @IsDateString()
  public endTime: Date;

  @IsString()
  @IsNotEmpty()
  public contactPerson: string;

  @IsString()
  @IsNotEmpty()
  public contact: string;

  @IsString()
  public approvedBy?: string;

  @IsEnum(ViewAccessEnum)
  @IsNotEmpty()
  public viewAccess: ViewAccessEnum;

  @IsEnum(EventTypeEnum)
  @IsNotEmpty()
  public type: EventTypeEnum;

  @IsOptional()
  @IsString()
  public additionalNotes?: string;

  @IsUUID()
  @IsOptional()
  public organizerId?: string;

  @IsUUID()
  @IsOptional()
  public encodedById?: string;

  @IsUUID(undefined, { each: true })
  @IsArray()
  public equipmentIds: string[];

  @IsUUID(undefined, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  public venueIds: string[];
}
