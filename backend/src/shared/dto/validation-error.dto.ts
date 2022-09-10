import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ErrorFieldDTO } from './error-field.dto';

export class ValidationErrorDTO {
  @IsBoolean()
  @IsNotEmpty()
  public hasErrors: boolean;

  @ValidateNested({ each: true })
  @IsArray()
  public errorFields: ErrorFieldDTO[] = [];
}
