import {
  IsArray,
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

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public notes: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  public schedule?: ScheduleDTO[];
}
