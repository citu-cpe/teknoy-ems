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
      additionalNotes: true,
      approvedBy: true,
      contactPerson: true,
      contactNumber: true,
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
      content: true,
      subtitle: true,
      tags: true,
      viewAccess: true,
    },
    equipmentReportFilterDTO: {
      brand: true,
      notes: true,
      serial: true,
      schedules: true,
      type: true,
    },
    organizerReportFilterDTO: {
      type: true,
    },
    venueReportFilterDTO: {
      notes: true,
      schedule: true,
    },
  },
};
