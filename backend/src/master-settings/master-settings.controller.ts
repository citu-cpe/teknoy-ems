import { Body, Controller, Get, Post } from '@nestjs/common';
import { Role } from 'prisma/prisma-client';
import { Roles } from '../authorization/decorators/roles.decorator';
import { MasterSettingsDTO } from './dto/master-settings.dto';
import { MasterSettingsService } from './master-settings.service';

@Controller(MasterSettingsController.API_PATH)
export class MasterSettingsController {
  public static readonly API_PATH = '/master-settings';

  constructor(private readonly masterSettingsService: MasterSettingsService) {}

  @Get()
  @Roles(Role.ADMIN)
  public async getMasterSettings(): Promise<MasterSettingsDTO> {
    return this.masterSettingsService.getMasterSettings();
  }

  @Post()
  @Roles(Role.ADMIN)
  public async setMasterSettings(
    @Body() dto: MasterSettingsDTO
  ): Promise<void> {
    return this.masterSettingsService.setMasterSettings(dto);
  }
}
