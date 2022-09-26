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

export class EquipmentDTO {
  @IsUUID()
  @IsString()
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
  @IsOptional()
  public notes: string;
}
