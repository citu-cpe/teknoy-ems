import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ScheduleDTO } from './dto/schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller(ScheduleController.SCHEDULE_API_PATH)
export class ScheduleController {
  public static SCHEDULE_API_PATH = '/schedule';
  public static ID_API_PATH = '/:id';

  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  public getSchedules(): Promise<ScheduleDTO[]> {
    return this.scheduleService.getSchedules();
  }

  @Get(ScheduleController.ID_API_PATH)
  public getScheduleById(@Param('id') id: string): Promise<ScheduleDTO> {
    return this.scheduleService.getScheduleById(id);
  }

  @Post()
  public createSchedule(
    @Body() scheduleDTO: ScheduleDTO
  ): Promise<ScheduleDTO> {
    return this.scheduleService.createSchedule(scheduleDTO);
  }

  @Put(ScheduleController.ID_API_PATH)
  public editSchedule(
    @Param('id') id: string,
    @Body() scheduleDTO: ScheduleDTO
  ): Promise<ScheduleDTO> {
    return this.scheduleService.editSchedule(id, scheduleDTO);
  }

  @Delete(ScheduleController.ID_API_PATH)
  public deleteSchedule(@Param('id') id: string): Promise<ScheduleDTO> {
    return this.scheduleService.deleteSchedule(id);
  }
}
