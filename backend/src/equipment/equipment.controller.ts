import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Put,
  Req,
} from '@nestjs/common';
import { RequestWithUser } from '../authentication/types/request-with-user.interface';
import { ScheduleDTO } from '../schedule/dto/schedule.dto';
import { EquipmentDTO } from './dto/equipment.dto';
import { EquipmentService } from './equipment.service';

@Controller(EquipmentController.EQUIPMENT_API_PATH)
export class EquipmentController {
  public static readonly EQUIPMENT_API_PATH = '/equipment';
  public static readonly EQUIPMENT_ID_ROUTE = '/:id';
  public static readonly EQUIPMENT_CONTROLLER_WITH_SCHED = '/schedule/:id';
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  public async getAllEquipments(): Promise<EquipmentDTO[]> {
    return this.equipmentService.getAllEquipments();
  }
  @Get(EquipmentController.EQUIPMENT_ID_ROUTE)
  public async getEquipmenyByid(
    @Param('id') id: string
  ): Promise<EquipmentDTO> {
    return this.equipmentService.getEquipmenyById(id);
  }
  @Post()
  public async addEquipment(
    @Req() { user }: RequestWithUser,
    @Body() data: EquipmentDTO
  ): Promise<EquipmentDTO> {
    return this.equipmentService.addEquipment(user, data);
  }
  @Post(EquipmentController.EQUIPMENT_CONTROLLER_WITH_SCHED)
  public async addScheduletoEquipment(
    @Param('id') id: string,
    @Body() data: ScheduleDTO
  ): Promise<EquipmentDTO> {
    return this.equipmentService.addScheduletoEquipment(id, data);
  }
  @Delete(EquipmentController.EQUIPMENT_ID_ROUTE)
  public async deleteEquipment(
    @Req() { user }: RequestWithUser,
    @Param('id') id: string
  ): Promise<EquipmentDTO> {
    return this.equipmentService.deleteEquipment(user, id);
  }

  @Put(EquipmentController.EQUIPMENT_ID_ROUTE)
  public async updateEquipment(
    @Req() { user }: RequestWithUser,
    @Param('id') id: string,
    @Body() data: EquipmentDTO
  ): Promise<EquipmentDTO> {
    return this.equipmentService.updateEquipment(user, id, data);
  }
}
