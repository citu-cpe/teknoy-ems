import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { NotificationDTO } from './notification.dto';

export class NotificationsDTO {
  @IsNumber()
  @IsNotEmpty()
  public numberOfUnread: number;

  @IsArray()
  @ValidateNested({ each: true })
  public notifications: NotificationDTO[];
}
