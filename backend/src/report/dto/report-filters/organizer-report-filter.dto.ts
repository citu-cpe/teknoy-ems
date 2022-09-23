import { IsBoolean, IsOptional } from 'class-validator';

export class OrganizerReportFilterDTO {
  @IsBoolean()
  @IsOptional()
  public id?: boolean;

  @IsBoolean()
  @IsOptional()
  public name?: boolean;

  @IsBoolean()
  @IsOptional()
  public type?: boolean;
}
