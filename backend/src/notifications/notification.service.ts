import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';
import { ActivityLog, Notification, User } from 'prisma/prisma-client';
import { NotificationDTO } from './dto/notification.dto';
import { NotificationsDTO } from './dto/notifications.dto';
import { ActivityLogListenerService } from '../activity-log/activity-log.service';
import { NotificationDateFilterEnum } from './dto/notification-filter.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}
  public async getFilteredNotifications(
    user: User,
    filter: NotificationDateFilterEnum
  ): Promise<NotificationsDTO> {
    try {
      switch (filter) {
        case NotificationDateFilterEnum.TODAY:
          return await this.getTodaysNotifications(user);
        case NotificationDateFilterEnum.LAST_WEEK:
          return await this.getLastWeekNotifications(user);
        case NotificationDateFilterEnum.LAST_MONTH:
          return await this.getLastMonthNotifications(user);
        default:
          return await this.getNotifications(user);
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }
  public async getNotifications(user: User): Promise<NotificationsDTO> {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          user: {
            id: user.id,
          },
        },
        include: {
          activityLog: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          activityLog: {
            createdAt: 'desc',
          },
        },
      });
      return {
        numberOfUnread: notifications.filter((n) => n.unread).length,
        notifications: notifications.map((n) =>
          NotificationService.convertToDTO(n)
        ),
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }
  public async getTodaysNotifications(user: User): Promise<NotificationsDTO> {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          user: {
            id: user.id,
          },
          activityLog: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 1)),
              lte: new Date(new Date().setDate(new Date().getDate())),
            },
          },
        },
        include: {
          activityLog: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          activityLog: {
            createdAt: 'desc',
          },
        },
      });
      return {
        numberOfUnread: notifications.filter((n) => n.unread).length,
        notifications: notifications.map((n) =>
          NotificationService.convertToDTO(n)
        ),
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }
  public async getLastWeekNotifications(user: User): Promise<NotificationsDTO> {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          user: {
            id: user.id,
          },
          activityLog: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 8)),
              lte: new Date(new Date().setDate(new Date().getDate())),
            },
          },
        },
        include: {
          activityLog: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          activityLog: {
            createdAt: 'desc',
          },
        },
      });
      return {
        numberOfUnread: notifications.filter((n) => n.unread).length,
        notifications: notifications.map((n) =>
          NotificationService.convertToDTO(n)
        ),
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }
  public async getLastMonthNotifications(
    user: User
  ): Promise<NotificationsDTO> {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          user: {
            id: user.id,
          },
          activityLog: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 31)),
              lte: new Date(new Date().setDate(new Date().getDate())),
            },
          },
        },
        include: {
          activityLog: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          activityLog: {
            createdAt: 'desc',
          },
        },
      });
      return {
        numberOfUnread: notifications.filter((n) => n.unread).length,
        notifications: notifications.map((n) =>
          NotificationService.convertToDTO(n)
        ),
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  public async createNotification(
    activityLogId: string,
    userId: string
  ): Promise<void> {
    try {
      const getAllUsers = await this.prisma.user.findMany({
        where: {
          id: {
            not: userId,
          },
        },
      });
      const newNotifs = getAllUsers.map(async (user) => {
        await this.prisma.notification.create({
          data: {
            activityLog: {
              connect: {
                id: activityLogId,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      });
      await Promise.all(newNotifs);
    } catch (error) {
      throw new BadRequestException();
    }
  }
  public async markNotificationAsRead(notification: NotificationDTO) {
    try {
      await this.prisma.notification.update({
        where: {
          id: notification.id,
        },
        data: {
          unread: false,
        },
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }
  public async markAllNotificationsAsRead(user: User) {
    try {
      await this.prisma.notification.updateMany({
        where: {
          user: {
            id: user.id,
          },
        },
        data: {
          unread: false,
        },
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }
  public async deleteNotification(notification: NotificationDTO) {
    try {
      await this.prisma.notification.delete({
        where: {
          id: notification.id,
        },
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }
  public async deleteAllNotifications(user: User) {
    try {
      await this.prisma.notification.deleteMany({
        where: {
          user: {
            id: user.id,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  public static convertToDTO(
    notification: Notification & {
      activityLog: ActivityLog;
    }
  ): NotificationDTO {
    const notificationDTO = new NotificationDTO();
    notificationDTO.id = notification.id;
    notificationDTO.userId = notification.userId;
    notificationDTO.activityLogId = notification.activityLogId;
    notificationDTO.unread = notification.unread;
    notificationDTO.activityLog = ActivityLogListenerService.convertToDTO(
      notification.activityLog
    );

    return notificationDTO;
  }
}
