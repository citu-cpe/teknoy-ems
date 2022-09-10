import { IsString, IsNotEmpty } from 'class-validator';

export class ErrorFieldDTO {
  @IsString()
  @IsNotEmpty()
  public fieldName: string;

  @IsString()
  @IsNotEmpty()
  public errorMessage: string;
}
