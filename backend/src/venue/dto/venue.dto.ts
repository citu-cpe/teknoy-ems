import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ScheduleDTO } from '../../schedule/dto/schedule.dto';

export class VenueDTO {
  @IsUUID()
  @IsOptional()
  public id?: string;

  @IsDateString()
  @IsOptional()
  public createdAt?: Date;

  @IsDateString()
  @IsOptional()
  public updatedAt?: Date;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public notes?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  public schedule?: ScheduleDTO[];
}
