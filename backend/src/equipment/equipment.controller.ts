import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
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
  public async addEquipment(@Body() data: EquipmentDTO): Promise<EquipmentDTO> {
    return this.equipmentService.addEquipment(data);
  }
  @Post(EquipmentController.EQUIPMENT_CONTROLLER_WITH_SCHED)
  public async addScheduletoEquipment(
    @Param('id') id: string,
    @Body() data: ScheduleDTO
  ): Promise<EquipmentDTO> {
    return this.equipmentService.addScheduletoEquipment(id, data);
  }
  @Delete(EquipmentController.EQUIPMENT_ID_ROUTE)
  public async deleteEquipment(@Param('id') id: string): Promise<EquipmentDTO> {
    return this.equipmentService.deleteEquipment(id);
  }

  @Put(EquipmentController.EQUIPMENT_ID_ROUTE)
  public async updateEquipment(
    @Param('id') id: string,
    @Body() data: EquipmentDTO
  ): Promise<EquipmentDTO> {
    return this.equipmentService.updateEquipment(id, data);
  }
}
