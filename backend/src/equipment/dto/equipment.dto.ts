import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ScheduleDTO } from '../../schedule/dto/schedule.dto';

export class EquipmentDTO {
  @IsUUID()
  @IsString()
  @IsOptional()
  public id?: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public type: string;

  @IsString()
  @IsOptional()
  public brand?: string;

  @IsString()
  @IsOptional()
  public serial?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  public schedules?: ScheduleDTO[];

  @IsString()
  @IsNotEmpty()
  public notes: string;
}
