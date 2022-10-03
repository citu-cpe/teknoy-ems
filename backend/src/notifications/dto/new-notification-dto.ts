import { IsNotEmpty, IsUUID } from 'class-validator';

export class NewNotificationDTO {
  @IsUUID()
  @IsNotEmpty()
  public userId: string;

  @IsNotEmpty()
  @IsUUID()
  public activityLogId: string;
}
