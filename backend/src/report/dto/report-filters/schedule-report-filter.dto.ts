import { IsBoolean, IsOptional } from 'class-validator';

export class ScheduleReportFilterDTO {
  @IsBoolean()
  @IsOptional()
  public availability?: boolean;

  @IsBoolean()
  @IsOptional()
  public startTime?: boolean;

  @IsBoolean()
  @IsOptional()
  public endTime?: boolean;
}
