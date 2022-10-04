import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ActivityLogDTO } from '../../activity-log/dto/activity-log.dto';

export class NotificationDTO {
  @IsUUID()
  @IsNotEmpty()
  public id: string;

  @IsUUID()
  @IsNotEmpty()
  public userId: string;

  @IsUUID()
  @IsNotEmpty()
  public activityLogId: string;

  @ValidateNested({ each: true })
  @IsNotEmpty()
  public activityLog: ActivityLogDTO;

  @IsDateString()
  @IsOptional()
  public createdAt?: Date;

  @IsDateString()
  @IsOptional()
  public updatedAt?: Date;

  @IsNotEmpty()
  @IsBoolean()
  public unread: boolean;
}
