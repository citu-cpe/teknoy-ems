import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketEnum } from '../web-socket/enum/web-socket.enum';
import { RequestWithUser } from '../authentication/types/request-with-user.interface';
import { NotificationDateFilterEnum } from './dto/notification-filter.dto';
import { NotificationDTO } from './dto/notification.dto';
import { NotificationsDTO } from './dto/notifications.dto';
import { NotificationGateway } from './notication.gateway';
import { NotificationService } from './notification.service';

@Controller(NotificationController.NOTIFICATION_API_ROUTE)
export class NotificationController {
  public static readonly NOTIFICATION_API_ROUTE = '/notification';
  public static readonly NOTIFICATION_ALL = '/all';
  public static readonly NOTIFICATION_TODAY = '/today';
  public static readonly NOTIFICATION_LAST_WEEK = '/last-week';
  public static readonly NOTIFICATION_LAST_MONTH = '/last-month';
  public static readonly NOTIFICATION_FILTERED = '/:filter';
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway
  ) {}

  @Get(NotificationController.NOTIFICATION_TODAY)
  public async filterTodayNotifications(
    @Req() { user }: RequestWithUser
  ): Promise<NotificationsDTO> {
    return this.notificationService.getTodaysNotifications(user);
  }
  @Get(NotificationController.NOTIFICATION_LAST_WEEK)
  public async filterLastWeeksNotifications(
    @Req() { user }: RequestWithUser
  ): Promise<NotificationsDTO> {
    return this.notificationService.getLastWeekNotifications(user);
  }
  @Get(NotificationController.NOTIFICATION_LAST_MONTH)
  public async filterLastMonthsNotifications(
    @Req() { user }: RequestWithUser
  ): Promise<NotificationsDTO> {
    return this.notificationService.getLastMonthNotifications(user);
  }
  @Get(NotificationController.NOTIFICATION_FILTERED)
  public async getFilteredNotifications(
    @Req() { user }: RequestWithUser,
    @Param('filter') filter: NotificationDateFilterEnum
  ) {
    return this.notificationService.getFilteredNotifications(user, filter);
  }
  @Get()
  public async getNotifications(
    @Req() { user }: RequestWithUser
  ): Promise<NotificationsDTO> {
    return this.notificationService.getNotifications(user);
  }

  @OnEvent(WebSocketEnum.CREATE_NOTIFICATIONS)
  @Post()
  public async createNotifications(
    activityLogId: string,
    userId: string
  ): Promise<void> {
    this.notificationGateway.server.emit(WebSocketEnum.NOTIFICATION);
    return this.notificationService.createNotification(activityLogId, userId);
  }

  @Put()
  public async markNotificationAsRead(@Body() notification: NotificationDTO) {
    return this.notificationService.markNotificationAsRead(notification);
  }
  @Put(NotificationController.NOTIFICATION_ALL)
  public async markAllNotificationsAsRead(
    @Req() { user }: RequestWithUser
  ): Promise<void> {
    return this.notificationService.markAllNotificationsAsRead(user);
  }
  @Delete()
  public async deleteNotification(@Body() notification: NotificationDTO) {
    return this.notificationService.deleteNotification(notification);
  }
  @Delete(NotificationController.NOTIFICATION_ALL)
  public async deleteAllNotifications(@Req() { user }: RequestWithUser) {
    return this.notificationService.deleteAllNotifications(user);
  }
}
