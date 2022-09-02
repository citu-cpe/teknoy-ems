import { Schedule } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';
import { AvailabilityEnum, ScheduleDTO } from './dto/schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createSchedule(scheduleDTO: ScheduleDTO): Promise<ScheduleDTO> {
    const createdSchedule = await this.prismaService.schedule.create({
      data: scheduleDTO,
    });

    return ScheduleService.convertToDTO(createdSchedule);
  }

  public async getSchedules(): Promise<ScheduleDTO[]> {
    const schedules = await this.prismaService.schedule.findMany();

    return schedules.map((schedule) => ScheduleService.convertToDTO(schedule));
  }

  public async getScheduleById(id: string): Promise<ScheduleDTO> {
    const schedule = await this.prismaService.schedule.findUniqueOrThrow({
      where: { id },
    });

    return ScheduleService.convertToDTO(schedule);
  }

  public async editSchedule(
    id: string,
    scheduleDTO: ScheduleDTO
  ): Promise<ScheduleDTO> {
    const updatedSchedule = await this.prismaService.schedule.update({
      data: scheduleDTO,
      where: { id },
    });

    return ScheduleService.convertToDTO(updatedSchedule);
  }

  public async deleteSchedule(id: string): Promise<ScheduleDTO> {
    const deleteSchedule = await this.prismaService.schedule.delete({
      where: { id },
    });

    return ScheduleService.convertToDTO(deleteSchedule);
  }

  public static convertToDTO(schedule: Schedule): ScheduleDTO {
    const scheduleDTO = new ScheduleDTO();
    scheduleDTO.id = schedule.id;
    scheduleDTO.availability =
      schedule.availability.toString() as AvailabilityEnum;
    scheduleDTO.startTime = schedule.startTime;
    scheduleDTO.endTime = schedule.endTime;

    return scheduleDTO;
  }
}
