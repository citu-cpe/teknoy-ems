import { IsBoolean, IsOptional } from 'class-validator';

export class VenueReportFilterDTO {
  @IsBoolean()
  @IsOptional()
  public id?: boolean;

  @IsBoolean()
  @IsOptional()
  public name?: boolean;

  @IsBoolean()
  @IsOptional()
  public notes?: boolean;

  @IsBoolean()
  @IsOptional()
  public schedule?: boolean;
}
