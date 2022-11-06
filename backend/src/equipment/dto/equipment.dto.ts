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

export enum EquipmentTypeEnum {
  PHOTO_DOCUMENTATION = 'PHOTO_DOCUMENTATION',
  VIDEO_DOCUMENTATION = 'VIDEO_DOCUMENTATION',
  PHOTO_AND_VIDEO_DOCUMENTATION = 'PHOTO_AND_VIDEO_DOCUMENTATION',
  LIVE_STREAMING = 'LIVE_STREAMING',
  MUSIC_BAND = 'MUSIC_BAND',
  OTHERS = 'OTHERS',
}

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
  public type: EquipmentTypeEnum;

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
  public notes?: string;
}
