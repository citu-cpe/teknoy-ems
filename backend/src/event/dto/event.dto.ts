import {
  IsUUID,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  Validate,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { EquipmentDTO } from '../../equipment/dto/equipment.dto';
import { OrganizerDTO } from '../../organizer/dto/organizer.dto';
import { IsBeforeConstraint } from '../../shared/validators/is-before.validator';
import { UserDTO } from '../../user/dto/user.dto';
import { VenueDTO } from '../../venue/dto/venue.dto';
import { StatusEnum, ViewAccessEnum, EventTypeEnum } from './event-create.dto';

export class EventDTO {
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
  @IsNotEmpty()
  public description: string;

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
  @IsNotEmpty()
  public approvedBy: string;

  @IsEnum(ViewAccessEnum)
  @IsNotEmpty()
  public viewAccess: ViewAccessEnum;

  @IsEnum(EventTypeEnum)
  @IsNotEmpty()
  public type: EventTypeEnum;

  @IsOptional()
  @IsString()
  public additionalNotes?: string;

  @ValidateNested()
  public organizer: OrganizerDTO;

  @ValidateNested()
  public encodedBy: UserDTO;

  @ValidateNested({ each: true })
  @IsArray()
  public equipments: EquipmentDTO[];

  @ValidateNested({ each: true })
  @IsArray()
  public venues: VenueDTO[];
}
