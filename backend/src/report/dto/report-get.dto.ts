import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { ReportFilterDTO } from './report-filter.dto';

export class ReportGetDTO {
  @IsString()
  @IsOptional()
  public message?: string;

  @ValidateNested()
  @Type(() => ReportFilterDTO)
  public reportFilterDTO: ReportFilterDTO;
}
