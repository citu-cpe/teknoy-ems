import {
  ClassSerializerInterceptor,
  ModuleMetadata,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, Reflector, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import Joi from 'joi';
import { OrganizerModule } from '../organizer/organizer.module';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { JwtAuthenticationGuard } from '../authentication/guards/jwt-authentication.guard';
import { AuthorizationModule } from '../authorization/authorization.module';
import { ActiveProfilesModule } from '../global/active-profiles/active-profiles.module';
import { E2EModule } from '../global/e2e/e2e.module';
import { PrismaModule } from '../global/prisma/prisma.module';
import { TestDataModule } from '../global/test-data/test-data.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { UserModule } from '../user/user.module';
import { EquipmentModule } from '../equipment/equipment.module';
import { VenueModule } from '../venue/venue.module';
import { AnnouncementModule } from '../announcement/announcement.module';
import { EventModule } from '../event/event.module';
import { ReportModule } from '../report/report.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { WebSocketsModule } from '../web-socket/web-socket.module';
import { NotificationModule } from '../notifications/notification.module';

export const appModule: ModuleMetadata = {
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', 'local.env'],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        HEROKU_APP_NAME: Joi.string(),
        HEROKU_BRANCH: Joi.string(),
        HEROKU_PR_NUMBER: Joi.number(),
        PORT: Joi.number(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
        ACTIVE_PROFILES: Joi.string(),
      }),
    }),
    AuthenticationModule,
    UserModule,
    AuthorizationModule,
    PrismaModule,
    ActiveProfilesModule,
    TestDataModule,
    E2EModule,
    ScheduleModule,
    OrganizerModule,
    EquipmentModule,
    VenueModule,
    AnnouncementModule,
    EventModule,
    ReportModule,
    EventEmitterModule.forRoot(),
    ActivityLogModule,
    WebSocketsModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) =>
        new JwtAuthenticationGuard(reflector),
      inject: [Reflector],
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(reflector),
      inject: [Reflector],
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
};
