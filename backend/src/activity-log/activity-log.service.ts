import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ActionENUM,
  ActivityLogDTO,
  PriorityENUM,
} from './dto/activity-log.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../global/prisma/prisma.service';
import { ActivityLogGateway } from './activity-log.gateway';
import { ActiveProfilesService } from '../global/active-profiles/active-profiles.service';
import { WebSocketEnum } from '../web-socket/enum/web-socket.enum';
import { ActivityLog, User } from 'prisma/prisma-client';

@Injectable()
export class ActivityLogListenerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly activityLogGateway: ActivityLogGateway,
    private readonly activeProfilesService: ActiveProfilesService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @OnEvent('create.logs')
  public async handleEventsCreation(dto: ActivityLogDTO) {
    if (!this.activeProfilesService.isTestProfileActive()) {
      try {
        const activityLog = await this.prismaService.activityLog.create({
          data: {
            entityId: dto.entityId,
            entityName: dto.entityName,
            action: dto.action,
            priority: dto.priority,
            oldValue: dto.oldValue || null,
            newValue: dto.newValue || null,
            executedAt: dto.executedAt,
            user: {
              connect: {
                id: dto.userId,
              },
            },
          },
        });
        if (activityLog) {
          try {
            const activity = await this.prismaService.activityLog.findUnique({
              where: { id: activityLog.id },
              include: { user: true },
            });
            this.eventEmitter.emit(
              WebSocketEnum.CREATE_NOTIFICATIONS,
              activityLog.id,
              dto.userId
            );
            if (
              dto.priority === PriorityENUM.IMPORTANT ||
              dto.priority === PriorityENUM.PUBLIC
            ) {
              this.activityLogGateway.server.emit(
                WebSocketEnum.NOTIFICATIONS_ACTIVITY,
                ActivityLogListenerService.convertToDTO(activity)
              );
            }
          } catch (error) {
            throw new NotFoundException(error);
          }
        }
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
  }
  public static convertToDTO(
    activityLog: ActivityLog & { user?: User }
  ): ActivityLogDTO {
    const activityDto = new ActivityLogDTO();
    activityDto.id = activityLog.id;
    activityDto.entityId = activityLog.entityId;
    activityDto.entityName = activityLog.entityName;
    activityDto.action = activityLog.action.toString() as ActionENUM;
    activityDto.userId = activityLog.userId;
    activityDto.priority = activityLog.priority.toString() as PriorityENUM;
    activityDto.oldValue = activityLog.oldValue;
    activityDto.newValue = activityLog.newValue;
    activityDto.executedAt = activityLog.executedAt;
    activityDto.createdAt = activityLog.createdAt;
    activityDto.updatedAt = activityLog.updatedAt;
    activityDto.user = activityLog.user;

    return activityDto;
  }
}
