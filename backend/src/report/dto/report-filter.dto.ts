import { ValidateNested } from 'class-validator';
import { AnnouncementReportFilterDTO } from './report-filters/announcement-report-filter.dto';
import { EquipmentReportFilterDTO } from './report-filters/equipment-report-filter.dto';
import { EventReportFilterDTO } from './report-filters/event-report-filter.dto';
import { OrganizerReportFilterDTO } from './report-filters/organizer-report-filter.dto';
import { VenueReportFilterDTO } from './report-filters/venue-report-filter.dto';

export class ReportFilterDTO {
  @ValidateNested()
  public eventReportFilterDTO: EventReportFilterDTO;

  @ValidateNested()
  public announcementReportFilterDTO: AnnouncementReportFilterDTO;

  @ValidateNested()
  public equipmentReportFilterDTO: EquipmentReportFilterDTO;

  @ValidateNested()
  public organizerReportFilterDTO: OrganizerReportFilterDTO;

  @ValidateNested()
  public venueReportFilterDTO: VenueReportFilterDTO;
}
