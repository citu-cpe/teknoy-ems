import {
  IsDateString,
  IsOptional,
  IsUUID,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsBeforeConstraint } from '../../shared/validators/is-before.validator';
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

  @IsOptional()
  @IsUUID(undefined, { each: true })
  public organizerIds?: string[];

  @IsOptional()
  @IsDateString()
  @Validate(IsBeforeConstraint, ['endDate'])
  public startDate?: Date;

  @IsOptional()
  @IsDateString()
  public endDate?: Date;
}
