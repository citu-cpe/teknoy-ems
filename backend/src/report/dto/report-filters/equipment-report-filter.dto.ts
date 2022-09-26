import { IsBoolean, IsOptional } from 'class-validator';

export class EquipmentReportFilterDTO {
  @IsBoolean()
  @IsOptional()
  public id?: boolean;

  @IsBoolean()
  @IsOptional()
  public name?: boolean;

  @IsBoolean()
  @IsOptional()
  public type?: boolean;

  @IsBoolean()
  @IsOptional()
  public brand?: boolean;

  @IsBoolean()
  @IsOptional()
  public serial?: boolean;

  @IsBoolean()
  @IsOptional()
  public schedules?: boolean;

  @IsBoolean()
  @IsOptional()
  public notes?: boolean;
}
