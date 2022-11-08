import { Injectable } from '@nestjs/common';
import { MasterSettings } from 'prisma/prisma-client';
import { PrismaService } from '../global/prisma/prisma.service';
import { MasterSettingsDTO } from './dto/master-settings.dto';

@Injectable()
export class MasterSettingsService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getMasterSettings(): Promise<MasterSettingsDTO> {
    const masterSettings = await this.prismaService.masterSettings.findFirst();
    return this.convertToDTO(masterSettings);
  }

  public async setMasterSettings(dto: MasterSettingsDTO): Promise<void> {
    const masterSettings = await this.prismaService.masterSettings.findFirst();

    await this.prismaService.masterSettings.update({
      data: dto,
      where: { id: masterSettings.id },
    });
  }

  public convertToDTO(masterSettings: MasterSettings): MasterSettingsDTO {
    return {
      allowOrganizersCRUD: masterSettings.allowOrganizersCRUD,
    };
  }
}
