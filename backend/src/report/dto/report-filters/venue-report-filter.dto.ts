import { IsBoolean, IsOptional } from 'class-validator';

export class VenueReportFilterDTO {
  @IsBoolean()
  @IsOptional()
  public notes?: boolean;

  @IsBoolean()
  @IsOptional()
  public schedule?: boolean;
}
