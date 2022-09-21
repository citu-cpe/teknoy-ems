import { Injectable } from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';
import { ReportGetDTO } from './dto/report-get.dto';
import XLSX from 'xlsx';
import { User } from '@prisma/client';
import { EventDTO } from '../event/dto/event.dto';
import { EventService } from '../event/event.service';
import { EventReportFilterDTO } from './dto/report-filters/event-report-filter.dto';
import { EquipmentDTO } from '../equipment/dto/equipment.dto';
import { EquipmentReportFilterDTO } from './dto/report-filters/equipment-report-filter.dto';
import { EquipmentService } from '../equipment/equipment.service';
import { VenueDTO } from '../venue/dto/venue.dto';
import { VenueReportFilterDTO } from './dto/report-filters/venue-report-filter.dto';
import { VenueService } from '../venue/venue.service';
import { OrganizerDTO } from '../organizer/dto/organizer.dto';
import { OrganizerReportFilterDTO } from './dto/report-filters/organizer-report-filter.dto';
import { OrganizerService } from '../organizer/organizer.service';
import { AnnouncementDTO } from '../announcement/dto/announcement.dto';
import { AnnouncementReportFilterDTO } from './dto/report-filters/announcement-report-filter.dto';
import { AnnouncementServices } from '../announcement/announcement.service';

interface KeyValuePair {
  key: string;
  value: string;
}

@Injectable()
export class ReportService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getReport(reportGetDTO: ReportGetDTO, user: User): Promise<any> {
    const events = await this.prismaService.event.findMany({
      include: {
        encodedBy: true,
        organizer: true,
        equipments: { include: { equipment: true } },
        venues: { include: { venue: true } },
      },
    });
    const eventDTOs = events.map((e) => EventService.convertToDTO(e));

    const equipments = await this.prismaService.equipment.findMany({
      include: { schedules: true },
    });
    const equipmentDTOs = equipments.map((e) =>
      EquipmentService.convertToDTO(e)
    );

    const venues = await this.prismaService.venues.findMany({
      include: { schedules: true },
    });
    const venueDTOs = venues.map((v) => VenueService.convertToDTO(v));

    const organizers = await this.prismaService.organizer.findMany();
    const organizerDTOs = organizers.map((o) =>
      OrganizerService.convertToDTO(o)
    );

    const announcements = await this.prismaService.announcement.findMany();
    const announcementDTOs = announcements.map((a) =>
      AnnouncementServices.convertToDTO(a)
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      this.getFirstWorksheet(reportGetDTO, user),
      'Export Metadata'
    );

    XLSX.utils.book_append_sheet(
      workbook,
      this.getEventsWorksheet(
        eventDTOs,
        reportGetDTO.reportFilterDTO.eventReportFilterDTO
      ),
      'Events'
    );

    XLSX.utils.book_append_sheet(
      workbook,
      this.getEquipmentsWorksheet(
        equipmentDTOs,
        reportGetDTO.reportFilterDTO.equipmentReportFilterDTO
      ),
      'Equipments'
    );

    XLSX.utils.book_append_sheet(
      workbook,
      this.getVenuesWorksheet(
        venueDTOs,
        reportGetDTO.reportFilterDTO.venueReportFilterDTO
      ),
      'Venues'
    );

    XLSX.utils.book_append_sheet(
      workbook,
      this.getOrganizersWorksheet(
        organizerDTOs,
        reportGetDTO.reportFilterDTO.organizerReportFilterDTO
      ),
      'Organizers'
    );

    XLSX.utils.book_append_sheet(
      workbook,
      this.getAnnouncementsWorksheet(
        announcementDTOs,
        reportGetDTO.reportFilterDTO.announcementReportFilterDTO
      ),
      'Announcements'
    );

    XLSX.writeFileXLSX(workbook, 'report.xlsx');
  }

  private getFirstWorksheet(
    reportGetDTO: ReportGetDTO,
    user: User
  ): XLSX.WorkSheet {
    return XLSX.utils.aoa_to_sheet([
      ['Exported by', user.name],
      ['Exported at', new Date().toLocaleString()],
      [
        'Message',
        !reportGetDTO.message || reportGetDTO.message.length === 0
          ? 'n/a'
          : reportGetDTO.message,
      ],
    ]);
  }

  private getEventsWorksheet(
    events: EventDTO[],
    filter: EventReportFilterDTO
  ): XLSX.WorkSheet {
    const values: KeyValuePair[][] = [];

    for (const e of events) {
      const value: KeyValuePair[] = [];
      value.push({ key: 'Title', value: e.title });

      if (filter.description) {
        value.push({ key: 'Description', value: e.description });
      }
      if (filter.status) {
        value.push({ key: 'Status', value: e.status });
      }
      if (filter.startTime) {
        value.push({
          key: 'Start Time',
          value: e.startTime.toLocaleString(),
        });
      }
      if (filter.endTime) {
        value.push({
          key: 'End Time',
          value: e.endTime.toLocaleString(),
        });
      }
      if (filter.contactPerson) {
        value.push({ key: 'Contact Person', value: e.contactPerson });
      }
      if (filter.contactNumber) {
        value.push({ key: 'Contact Number', value: e.contactNumber });
      }
      if (filter.approvedBy) {
        value.push({ key: 'Approved By', value: e.approvedBy });
      }
      if (filter.viewAccess) {
        value.push({ key: 'View Access', value: e.viewAccess });
      }
      if (filter.type) {
        value.push({ key: 'Type', value: e.type });
      }
      if (filter.additionalNotes) {
        value.push({ key: 'Additional Notes', value: e.additionalNotes });
      }
      if (filter.organizer) {
        value.push({ key: 'Organizer', value: e.organizer.name });
      }
      if (filter.encodedBy) {
        value.push({ key: 'Encoded By', value: e.encodedBy.name });
      }
      if (filter.equipments) {
        value.push({
          key: 'Equipments',
          value: e.equipments.map((eq) => eq.name).join(', '),
        });
      }
      if (filter.venues) {
        value.push({
          key: 'Venues',
          value: e.venues.map((v) => v.name).join(', '),
        });
      }

      values.push(value);
    }

    const defaultHeaderRows = [
      'Title',
      'Description',
      'Status',
      'Start Time',
      'End Time',
      'Contact Person',
      'Contact Number',
      'Approved By',
      'View Access',
      'Type',
      'Additional Notes',
      'Organinzer',
      'Encoded By',
      'Equipments',
      'Venues',
    ];

    const headerRow = values[0]
      ? values[0].map((e) => e.key)
      : defaultHeaderRows;
    const valueRows = values.map((va) => va.map((v) => v.value));

    return XLSX.utils.aoa_to_sheet([headerRow, ...valueRows]);
  }

  private getEquipmentsWorksheet(
    equipments: EquipmentDTO[],
    filter: EquipmentReportFilterDTO
  ): XLSX.WorkSheet {
    const values: KeyValuePair[][] = [];

    for (const e of equipments) {
      const value: KeyValuePair[] = [];
      value.push({ key: 'Name', value: e.name });

      if (filter.type) {
        value.push({ key: 'Type', value: e.type });
      }
      if (filter.brand) {
        value.push({ key: 'Brand', value: e.brand });
      }
      if (filter.serial) {
        value.push({ key: 'Serial', value: e.serial });
      }
      if (filter.schedules) {
        value.push({
          key: 'Schedules',
          value: e.schedules
            .map(
              (s) =>
                `[${s.startTime.toLocaleString()} - ${s.endTime.toLocaleString()}]`
            )
            .join(', '),
        });
      }
      if (filter.notes) {
        value.push({ key: 'Notes', value: e.notes });
      }

      values.push(value);
    }

    const defaultHeaderRows = [
      'Name',
      'Type',
      'Brand',
      'Serial',
      'Schedules',
      'Notes',
    ];
    const headerRow = values[0]
      ? values[0].map((e) => e.key)
      : defaultHeaderRows;
    const valueRows = values.map((va) => va.map((v) => v.value));

    return XLSX.utils.aoa_to_sheet([headerRow, ...valueRows]);
  }

  private getVenuesWorksheet(
    venues: VenueDTO[],
    filter: VenueReportFilterDTO
  ): XLSX.WorkSheet {
    const values: KeyValuePair[][] = [];

    for (const v of venues) {
      const value: KeyValuePair[] = [];
      value.push({ key: 'Name', value: v.name });

      if (filter.notes) {
        value.push({ key: 'Notes', value: v.notes });
      }
      if (filter.schedule) {
        value.push({
          key: 'Schedules',
          value: v.schedule
            .map(
              (s) =>
                `[${s.startTime.toLocaleString()} - ${s.endTime.toLocaleString()}]`
            )
            .join(', '),
        });
      }

      values.push(value);
    }

    const defaultHeaderRows = ['Name', 'Notes', 'Schedules'];
    const headerRow = values[0]
      ? values[0].map((e) => e.key)
      : defaultHeaderRows;
    const valueRows = values.map((va) => va.map((v) => v.value));

    return XLSX.utils.aoa_to_sheet([headerRow, ...valueRows]);
  }

  private getOrganizersWorksheet(
    organizers: OrganizerDTO[],
    filter: OrganizerReportFilterDTO
  ): XLSX.WorkSheet {
    const values: KeyValuePair[][] = [];

    for (const o of organizers) {
      const value: KeyValuePair[] = [];
      value.push({ key: 'name', value: o.name });

      if (filter.type) {
        value.push({ key: 'Type', value: o.type });
      }

      values.push(value);
    }

    const defaultHeaderRows = ['Name', 'Notes', 'Schedules'];
    const headerRow = values[0]
      ? values[0].map((e) => e.key)
      : defaultHeaderRows;
    const valueRows = values.map((va) => va.map((v) => v.value));

    return XLSX.utils.aoa_to_sheet([headerRow, ...valueRows]);
  }

  private getAnnouncementsWorksheet(
    announcements: AnnouncementDTO[],
    filter: AnnouncementReportFilterDTO
  ): XLSX.WorkSheet {
    const values: KeyValuePair[][] = [];

    for (const a of announcements) {
      const value: KeyValuePair[] = [];
      value.push({ key: 'Title', value: a.title });

      if (filter.subtitle) {
        value.push({ key: 'Subtitle', value: a.subtitle });
      }
      if (filter.content) {
        value.push({ key: 'Content', value: a.content });
      }
      if (filter.tags) {
        value.push({ key: 'Tags', value: a.tags.join(', ') });
      }
      if (filter.viewAccess) {
        value.push({ key: 'View Access', value: a.viewAccess });
      }

      values.push(value);
    }

    const defaultHeaderRows = ['Name', 'Notes', 'Schedules'];
    const headerRow = values[0]
      ? values[0].map((e) => e.key)
      : defaultHeaderRows;
    const valueRows = values.map((va) => va.map((v) => v.value));

    return XLSX.utils.aoa_to_sheet([headerRow, ...valueRows]);
  }
}
