import { IsArray, ValidateNested } from 'class-validator';
import { VenueDTO } from '../../venue/dto/venue.dto';

export class SortedVenuesDTO {
  @ValidateNested({ each: true })
  @IsArray()
  public availableVenues: VenueDTO[];

  @ValidateNested({ each: true })
  @IsArray()
  public unavailableVenues: VenueDTO[];
}
