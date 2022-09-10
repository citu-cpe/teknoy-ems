import { EquipmentController } from '../../../src/equipment/equipment.controller';
import { EquipmentDTO } from '../../../src/equipment/dto/equipment.dto';
import { HttpStatus } from '@nestjs/common';
import { requestWithStaff } from '../setup';

const equipmentRoute = EquipmentController.EQUIPMENT_API_PATH;

export const testAddEquipment: EquipmentDTO = {
  name: 'EPSON Large 3',
  type: 'CAMERA',
  brand: 'EPSON',
  serial: 'GIJDKSLS',
  notes: 'handle with care',
};

export const testAddEquipmentWithSameName: EquipmentDTO = {
  name: 'SONY CAM 1',
  type: 'CAMERA',
  brand: 'EPSON',
  serial: 'GIJDKSLS',
  notes: 'handle with care',
};

export const testAddEquipmentWithSameSerial: EquipmentDTO = {
  name: 'SONY CAM 1',
  type: 'CAMERA',
  brand: 'EPSON',
  serial: '123456789',
  notes: 'handle with care',
};

export const addEquipment = async (
  dto: EquipmentDTO
): Promise<EquipmentDTO> => {
  const { body } = await requestWithStaff
    .post(equipmentRoute)
    .send(dto)
    .expect(HttpStatus.CREATED);

  return body;
};

export const addEquipmentWithSameName = async (
  dto: EquipmentDTO
): Promise<EquipmentDTO> => {
  const { body } = await requestWithStaff
    .post(equipmentRoute)
    .send(dto)
    .expect(HttpStatus.BAD_REQUEST);

  return body;
};

export const addEquipmentWithSameSerial = async (
  dto: EquipmentDTO
): Promise<EquipmentDTO> => {
  const { body } = await requestWithStaff
    .post(equipmentRoute)
    .send(dto)
    .expect(HttpStatus.BAD_REQUEST);

  return body;
};