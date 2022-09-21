import { IsBoolean, IsOptional } from 'class-validator';

export class OrganizerReportFilterDTO {
  @IsBoolean()
  @IsOptional()
  public type?: boolean;
}
