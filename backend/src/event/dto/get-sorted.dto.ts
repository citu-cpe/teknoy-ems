import { IsDateString, Validate } from 'class-validator';
import { IsBeforeConstraint } from '../../shared/validators/is-before.validator';

export class GetSortedDTO {
  @IsDateString()
  @Validate(IsBeforeConstraint, ['endTime'])
  public startTime: Date;

  @IsDateString()
  public endTime: Date;
}
