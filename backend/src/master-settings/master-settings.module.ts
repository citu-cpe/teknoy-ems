import { Module } from '@nestjs/common';
import { MasterSettingsController } from './master-settings.controller';
import { MasterSettingsService } from './master-settings.service';

@Module({
  controllers: [MasterSettingsController],
  providers: [MasterSettingsService],
})
export class MasterSettingsModule {}
