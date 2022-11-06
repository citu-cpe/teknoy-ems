import { IsBoolean, IsNotEmpty } from 'class-validator';

export class MasterSettingsDTO {
  @IsBoolean()
  @IsNotEmpty()
  public allowOrganizersCRUD: boolean;
}
