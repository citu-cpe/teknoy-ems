import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { ReportFilterDTO } from './report-filter.dto';

export class ReportGetDTO {
  @IsString()
  @IsOptional()
  public message?: string;

  @ValidateNested()
  public reportFilterDTO: ReportFilterDTO;
}

export const defaultReportGetDTO: ReportGetDTO = {
  message: 'System report',
  reportFilterDTO: {
    eventReportFilterDTO: {
      id: true,
      title: true,
      additionalNotes: true,
      approvedBy: true,
      contactPerson: true,
      contact: true,
      description: true,
      encodedBy: true,
      endTime: true,
      equipments: true,
      organizer: true,
      startTime: true,
      status: true,
      type: true,
      venues: true,
      viewAccess: true,
    },
    announcementReportFilterDTO: {
      id: true,
      title: true,
      content: true,
      subtitle: true,
      tags: true,
      viewAccess: true,
    },
    equipmentReportFilterDTO: {
      id: true,
      name: true,
      brand: true,
      notes: true,
      serial: true,
      schedules: true,
      type: true,
    },
    organizerReportFilterDTO: {
      id: true,
      name: true,
      type: true,
    },
    venueReportFilterDTO: {
      id: true,
      name: true,
      notes: true,
      schedule: true,
    },
  },
};
