import { Role } from '.prisma/client';
import {
  Body,
  Controller,
  Get,
  Header,
  Req,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path/posix';
import { RequestWithUser } from '../authentication/types/request-with-user.interface';
import { Roles } from '../authorization/decorators/roles.decorator';
import { ReportGetDTO } from './dto/report-get.dto';
import { ReportService } from './report.service';

@Controller(ReportController.REPORT_API_PATH)
export class ReportController {
  public static readonly REPORT_API_PATH = '/report';

  constructor(private readonly reportService: ReportService) {}

  @Get()
  @Roles(Role.ADMIN)
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  @Header('Content-Disposition', 'attachment; filename="report.xlsx"')
  public async getReport(
    @Body() reportGetDTO: ReportGetDTO,
    @Req() { user }: RequestWithUser
  ): Promise<any> {
    await this.reportService.getReport(reportGetDTO, user);

    const file = createReadStream(join(process.cwd(), 'report.xlsx'));

    return new StreamableFile(file);
  }
}
