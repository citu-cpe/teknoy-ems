import { Injectable } from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';
import { ReportGetDTO } from './dto/report-get.dto';
import ExcelJS from 'exceljs';
import { User, Prisma } from '@prisma/client';
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
import { ReportFilterDTO } from './dto/report-filter.dto';

interface KeyValuePair {
  key: string;
  value: string;
}

@Injectable()
export class ReportService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getReport(reportGetDTO: ReportGetDTO, user: User): Promise<any> {
    const where = this.getEventWhereFilter(reportGetDTO.reportFilterDTO);

    const events = await this.prismaService.event.findMany({
      include: {
        encodedBy: true,
        organizer: true,
        equipments: { include: { equipment: true } },
        venues: { include: { venue: true } },
      },
      where,
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

    // const workbook = XLSX.utils.book_new();
    const workbook = new ExcelJS.Workbook();
    this.getFirstWorksheet(workbook, reportGetDTO, user);

    if (reportGetDTO.reportFilterDTO.eventReportFilterDTO) {
      this.getEventsWorksheet(
        workbook,
        eventDTOs,
        reportGetDTO.reportFilterDTO.eventReportFilterDTO
      );
    }

    if (reportGetDTO.reportFilterDTO.equipmentReportFilterDTO) {
      this.getEquipmentsWorksheet(
        workbook,
        equipmentDTOs,
        reportGetDTO.reportFilterDTO.equipmentReportFilterDTO
      );
    }

    if (reportGetDTO.reportFilterDTO.venueReportFilterDTO) {
      this.getVenuesWorksheet(
        workbook,
        venueDTOs,
        reportGetDTO.reportFilterDTO.venueReportFilterDTO
      );
    }

    if (reportGetDTO.reportFilterDTO.organizerReportFilterDTO) {
      this.getOrganizersWorksheet(
        workbook,
        organizerDTOs,
        reportGetDTO.reportFilterDTO.organizerReportFilterDTO
      );
    }

    if (reportGetDTO.reportFilterDTO.announcementReportFilterDTO) {
      this.getAnnouncementsWorksheet(
        workbook,
        announcementDTOs,
        reportGetDTO.reportFilterDTO.announcementReportFilterDTO
      );
    }

    await workbook.xlsx.writeFile('report.xlsx');
  }

  private getEventWhereFilter(filter: ReportFilterDTO): Prisma.EventWhereInput {
    let organizerFilter: Prisma.StringFilter | undefined;

    if (filter.organizerIds && filter.organizerIds.length > 0) {
      organizerFilter = { in: filter.organizerIds };
    }

    let dateFilter: Prisma.Enumerable<Prisma.EventWhereInput> | undefined;

    if (filter.startDate && filter.endDate) {
      dateFilter = {
        AND: {
          startTime: { lte: filter.endDate },
          endTime: { gte: filter.startDate },
        },
      };
    }

    const where: Prisma.EventWhereInput = {};

    if (organizerFilter) {
      where.organizerId = organizerFilter;
    }

    if (dateFilter) {
      where.AND = dateFilter;
    }

    return where;
  }

  private getFirstWorksheet(
    workbook: ExcelJS.Workbook,
    reportGetDTO: ReportGetDTO,
    user: User
  ): ExcelJS.Worksheet {
    const worksheet = workbook.addWorksheet('Export Metadata');

    worksheet.addRow(['Exported by', user.name]);
    worksheet.addRow(['Exported at', new Date().toLocaleString()]);
    worksheet.addRow([
      'Message',
      !reportGetDTO.message || reportGetDTO.message.length === 0
        ? 'n/a'
        : reportGetDTO.message,
    ]);
    worksheet.getColumn('A').font = { bold: true };

    return worksheet;
  }

  private getEventsWorksheet(
    workbook: ExcelJS.Workbook,
    events: EventDTO[],
    filter: EventReportFilterDTO
  ): ExcelJS.Worksheet {
    const worksheet = workbook.addWorksheet('Events');

    const values: KeyValuePair[][] = [];

    for (const e of events) {
      const value: KeyValuePair[] = [];

      if (filter.id) {
        value.push({ key: 'ID', value: e.id });
      }

      if (filter.title) {
        value.push({ key: 'Title', value: e.title });
      }

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
      if (filter.contact) {
        value.push({ key: 'Contact', value: e.contact });
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
      'ID',
      'Title',
      'Description',
      'Status',
      'Start Time',
      'End Time',
      'Contact Person',
      'Contact',
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
    worksheet.addRow(headerRow).font = { bold: true };
    worksheet.addRows(valueRows);

    return worksheet;
  }

  private getEquipmentsWorksheet(
    workbook: ExcelJS.Workbook,
    equipments: EquipmentDTO[],
    filter: EquipmentReportFilterDTO
  ): ExcelJS.Worksheet {
    const worksheet = workbook.addWorksheet('Equipments');

    const values: KeyValuePair[][] = [];

    for (const e of equipments) {
      const value: KeyValuePair[] = [];

      if (filter.id) {
        value.push({ key: 'ID', value: e.id });
      }

      if (filter.name) {
        value.push({ key: 'Name', value: e.name });
      }

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
      'ID',
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

    worksheet.addRow(headerRow).font = { bold: true };
    worksheet.addRows(valueRows);

    return worksheet;
  }

  private getVenuesWorksheet(
    workbook: ExcelJS.Workbook,
    venues: VenueDTO[],
    filter: VenueReportFilterDTO
  ): ExcelJS.Worksheet {
    const worksheet = workbook.addWorksheet('Venues');

    const values: KeyValuePair[][] = [];

    for (const v of venues) {
      const value: KeyValuePair[] = [];

      if (filter.id) {
        value.push({ key: 'ID', value: v.id });
      }

      if (filter.name) {
        value.push({ key: 'Name', value: v.name });
      }

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

    const defaultHeaderRows = ['ID', 'Name', 'Notes', 'Schedules'];
    const headerRow = values[0]
      ? values[0].map((e) => e.key)
      : defaultHeaderRows;
    const valueRows = values.map((va) => va.map((v) => v.value));

    worksheet.addRow(headerRow).font = { bold: true };
    worksheet.addRows(valueRows);

    return worksheet;
  }

  private getOrganizersWorksheet(
    workbook: ExcelJS.Workbook,
    organizers: OrganizerDTO[],
    filter: OrganizerReportFilterDTO
  ): ExcelJS.Worksheet {
    const worksheet = workbook.addWorksheet('Organizers');

    const values: KeyValuePair[][] = [];

    for (const o of organizers) {
      const value: KeyValuePair[] = [];

      if (filter.id) {
        value.push({ key: 'ID', value: o.id });
      }

      if (filter.name) {
        value.push({ key: 'Name', value: o.name });
      }

      if (filter.type) {
        value.push({ key: 'Type', value: o.type });
      }

      values.push(value);
    }

    const defaultHeaderRows = ['ID', 'Name', 'Notes', 'Schedules'];
    const headerRow = values[0]
      ? values[0].map((e) => e.key)
      : defaultHeaderRows;
    const valueRows = values.map((va) => va.map((v) => v.value));

    worksheet.addRow(headerRow).font = { bold: true };
    worksheet.addRows(valueRows);

    return worksheet;
  }

  private getAnnouncementsWorksheet(
    workbook: ExcelJS.Workbook,
    announcements: AnnouncementDTO[],
    filter: AnnouncementReportFilterDTO
  ): ExcelJS.Worksheet {
    const worksheet = workbook.addWorksheet('Announcements');

    const values: KeyValuePair[][] = [];

    for (const a of announcements) {
      const value: KeyValuePair[] = [];

      if (filter.id) {
        value.push({ key: 'ID', value: a.id });
      }

      if (filter.title) {
        value.push({ key: 'Title', value: a.title });
      }

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

    const defaultHeaderRows = ['ID', 'Name', 'Notes', 'Schedules'];
    const headerRow = values[0]
      ? values[0].map((e) => e.key)
      : defaultHeaderRows;
    const valueRows = values.map((va) => va.map((v) => v.value));

    worksheet.addRow(headerRow).font = { bold: true };
    worksheet.addRows(valueRows);

    return worksheet;
  }
}
