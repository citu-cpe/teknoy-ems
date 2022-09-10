import { IsArray, ValidateNested } from 'class-validator';
import { EquipmentDTO } from '../../equipment/dto/equipment.dto';

export class SortedEquipmentsDTO {
  @ValidateNested({ each: true })
  @IsArray()
  public availableEquipments: EquipmentDTO[];

  @ValidateNested({ each: true })
  @IsArray()
  public unavailableEquipments: EquipmentDTO[];
}
