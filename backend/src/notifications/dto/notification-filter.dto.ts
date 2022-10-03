import { IsEnum } from 'class-validator';

export enum NotificationDateFilterEnum {
  TODAY = 'TODAY',
  LAST_MONTH = 'LAST_MONTH',
  LAST_WEEK = 'LAST_WEEK',
  ALL = 'ALL',
}

export class NotificationFilterDTO {
  @IsEnum(NotificationDateFilterEnum)
  public dateFilter: NotificationDateFilterEnum;
}
