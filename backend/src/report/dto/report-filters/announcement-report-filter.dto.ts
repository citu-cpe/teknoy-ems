import { IsBoolean, IsOptional } from 'class-validator';

export class AnnouncementReportFilterDTO {
  @IsBoolean()
  @IsOptional()
  public subtitle?: boolean;

  @IsBoolean()
  @IsOptional()
  public content?: boolean;

  @IsBoolean()
  @IsOptional()
  public tags?: boolean;

  @IsBoolean()
  @IsOptional()
  public viewAccess?: boolean;
}
