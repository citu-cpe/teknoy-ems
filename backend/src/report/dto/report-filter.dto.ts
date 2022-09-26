import { IsOptional, ValidateNested } from 'class-validator';
import { AnnouncementReportFilterDTO } from './report-filters/announcement-report-filter.dto';
import { EquipmentReportFilterDTO } from './report-filters/equipment-report-filter.dto';
import { EventReportFilterDTO } from './report-filters/event-report-filter.dto';
import { OrganizerReportFilterDTO } from './report-filters/organizer-report-filter.dto';
import { VenueReportFilterDTO } from './report-filters/venue-report-filter.dto';

export class ReportFilterDTO {
  @ValidateNested()
  @IsOptional()
  public eventReportFilterDTO?: EventReportFilterDTO;

  @ValidateNested()
  @IsOptional()
  public announcementReportFilterDTO?: AnnouncementReportFilterDTO;

  @ValidateNested()
  @IsOptional()
  public equipmentReportFilterDTO?: EquipmentReportFilterDTO;

  @ValidateNested()
  @IsOptional()
  public organizerReportFilterDTO?: OrganizerReportFilterDTO;

  @ValidateNested()
  @IsOptional()
  public venueReportFilterDTO?: VenueReportFilterDTO;
}
