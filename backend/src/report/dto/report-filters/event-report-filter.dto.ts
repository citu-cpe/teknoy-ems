import { IsBoolean, IsOptional } from 'class-validator';

export class EventReportFilterDTO {
  @IsBoolean()
  @IsOptional()
  public description?: boolean;

  @IsBoolean()
  @IsOptional()
  public status?: boolean;

  @IsBoolean()
  @IsOptional()
  public startTime?: boolean;

  @IsBoolean()
  @IsOptional()
  public endTime?: boolean;

  @IsBoolean()
  @IsOptional()
  public contactPerson?: boolean;

  @IsBoolean()
  @IsOptional()
  public contactNumber?: boolean;

  @IsBoolean()
  @IsOptional()
  public approvedBy?: boolean;

  @IsBoolean()
  @IsOptional()
  public viewAccess?: boolean;

  @IsBoolean()
  @IsOptional()
  public type?: boolean;

  @IsBoolean()
  @IsOptional()
  public additionalNotes?: boolean;

  @IsBoolean()
  @IsOptional()
  public organizer?: boolean;

  @IsBoolean()
  @IsOptional()
  public encodedBy?: boolean;

  @IsBoolean()
  @IsOptional()
  public equipments?: boolean;

  @IsBoolean()
  @IsOptional()
  public venues?: boolean;
}
