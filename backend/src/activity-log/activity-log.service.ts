import { BadRequestException, Injectable } from '@nestjs/common';
import { ActivityLogDTO, PriorityENUM } from './dto/activity-log.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../global/prisma/prisma.service';
import { ActivityLogGateway } from './activity-log.gateway';
import { ActiveProfilesService } from '../global/active-profiles/active-profiles.service';
@Injectable()
export class AnnouncementCreateListenerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly activityLogGateway: ActivityLogGateway,
    private readonly activeProfilesService: ActiveProfilesService
  ) {}

  @OnEvent('create.logs')
  public async handleEventsCreation(dto: ActivityLogDTO) {
    if (!this.activeProfilesService.isTestProfileActive()) {
      try {
        await this.prismaService.activityLog.create({
          data: {
            entityName: dto.entityName,
            action: dto.action,
            username: dto.username,
            priority: dto.priority,
            oldValue: dto.oldValue || null,
            newValue: dto.newValue || null,
            executedAt: dto.executedAt,
          },
        });
        if (
          dto.priority === PriorityENUM.IMPORTANT ||
          dto.priority === PriorityENUM.PUBLIC
        ) {
          this.activityLogGateway.server.emit('notifications-activity', dto);
        }
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
  }
}
