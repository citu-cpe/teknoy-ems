import { EquipmentDTO } from 'generated-api';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useEquipment = () => {
  const api = useContext(ApiContext);

  const addEquipment = useMutation((equipmentDTO: EquipmentDTO) =>
    api.addEquipment(equipmentDTO)
  );

  const editEquipment = useMutation((equipmentDTO: EquipmentDTO) =>
    api.updateEquipment(equipmentDTO.id as string, equipmentDTO)
  );

  const fetchEquipmentById = useMutation((id: string) =>
    api.getEquipmenyByid(id)
  );

  return {
    addEquipment,
    editEquipment,
    fetchEquipmentById,
  };
};
