import { addEquipmentWithoutSched } from '../../../src/global/test-data/equipment-test-data.service';
import {
  EquipmentDTO,
  EquipmentTypeEnum,
} from '../../../src/equipment/dto/equipment.dto';
import { EquipmentController } from '../../../src/equipment/equipment.controller';
import {
  addEquipment,
  addEquipmentWithSameName,
  addEquipmentWithSameSerial,
  testAddEquipment,
  testAddEquipmentWithSameName,
  testAddEquipmentWithSameSerial,
} from '../fixtures/equipment.fixtures';
import { requestWithStaff } from '../setup';
import { HttpStatus } from '@nestjs/common';

describe('equipment.spec.ts - Equipment Controller', () => {
  const equipmentRoute = EquipmentController.EQUIPMENT_API_PATH;

  describe('POST /equipment', () => {
    it('should successfully add an equipment', async () => {
      const { name, type, brand, serial, notes }: EquipmentDTO =
        await addEquipment(testAddEquipment);

      expect(name).toEqual(testAddEquipment.name);
      expect(type).toEqual(testAddEquipment.type);
      expect(brand).toEqual(testAddEquipment.brand);
      expect(serial).toEqual(testAddEquipment.serial);
      expect(notes).toEqual(testAddEquipment.notes);
    });

    it('should successfully add an equipment even without populating brand, serial and notes field', async () => {
      const equipmentWithoutBrand: EquipmentDTO = {
        name: 'EPSON Large 4',
        type: EquipmentTypeEnum.PHOTO_AND_VIDEO_DOCUMENTATION,
        serial: 'GIJDKSLS',
        notes: 'handle with care',
      };

      const equipmentWithoutSerial: EquipmentDTO = {
        name: 'EPSON Large 3',
        type: EquipmentTypeEnum.PHOTO_AND_VIDEO_DOCUMENTATION,
        brand: 'EPSON',
        notes: 'handle with care',
      };

      const equipmentWithoutNotes: EquipmentDTO = {
        name: 'EPSON Large 2',
        type: EquipmentTypeEnum.PHOTO_AND_VIDEO_DOCUMENTATION,
        brand: 'EPSON',
        serial: 'OJSDFMCJ',
      };

      const equipmentWithoutAllOptional: EquipmentDTO = {
        name: 'EPSON Large 1',
        type: EquipmentTypeEnum.PHOTO_AND_VIDEO_DOCUMENTATION,
      };

      await requestWithStaff
        .post(equipmentRoute)
        .send(equipmentWithoutBrand)
        .expect(HttpStatus.CREATED);
      await requestWithStaff
        .post(equipmentRoute)
        .send(equipmentWithoutSerial)
        .expect(HttpStatus.CREATED);
      await requestWithStaff
        .post(equipmentRoute)
        .send(equipmentWithoutNotes)
        .expect(HttpStatus.CREATED);
      await requestWithStaff
        .post(equipmentRoute)
        .send(equipmentWithoutAllOptional)
        .expect(HttpStatus.CREATED);
    });

    it('should not successfully add an equipment with missing data', async () => {
      //brand, serial and notes fields are not required
      const equipmentWithoutName = {
        type: 'CAMERA',
        brand: 'EPSON',
        serial: 'GIJDKSLS',
        notes: 'handle with care',
      };
      const equipmentWithoutType = {
        name: 'EPSON Large 3',
        brand: 'EPSON',
        serial: 'GIJDKSLS',
        notes: 'handle with care',
      };

      await requestWithStaff
        .post(equipmentRoute)
        .send(equipmentWithoutName)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(equipmentRoute)
        .send(equipmentWithoutType)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not successfully add an equipment having the same name', async () => {
      await addEquipmentWithSameName(testAddEquipmentWithSameName);
      expect(testAddEquipmentWithSameName.name).toEqual(
        addEquipmentWithoutSched.name
      );
    });

    it('should not successfully add an equipment having the same serial', async () => {
      await addEquipmentWithSameSerial(testAddEquipmentWithSameSerial);
      expect(testAddEquipmentWithSameSerial.serial).toEqual(
        addEquipmentWithoutSched.serial
      );
    });
  });

  describe('GET /equipment', () => {
    it('should get all equipment', async () => {
      await requestWithStaff.get(equipmentRoute).expect(HttpStatus.OK);
    });
  });

  describe('GET /:id', () => {
    it('should get an equipment by id', async () => {
      await requestWithStaff
        .get(equipmentRoute + '/' + addEquipmentWithoutSched.id)
        .expect(HttpStatus.OK);
    });

    it('should not get an equipment with an id that does not exist', async () => {
      const id = '3e8e27e1-b023-40a6-a367-52ab65937d36'; //this id does not exist
      await requestWithStaff
        .get(equipmentRoute + '/' + id)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /:id', () => {
    it('should update equipment info', async () => {
      const updateEquipmentName: EquipmentDTO = {
        id: addEquipmentWithoutSched.id,
        name: 'EPSON Large 3',
        brand: addEquipmentWithoutSched.brand,
        type: addEquipmentWithoutSched.type.toString() as EquipmentTypeEnum,
        serial: addEquipmentWithoutSched.serial,
        notes: addEquipmentWithoutSched.notes,
      };
      const updateEquipmentBrand: EquipmentDTO = {
        id: addEquipmentWithoutSched.id,
        name: addEquipmentWithoutSched.name,
        brand: 'SONY',
        type: addEquipmentWithoutSched.type.toString() as EquipmentTypeEnum,
        serial: addEquipmentWithoutSched.serial,
        notes: addEquipmentWithoutSched.notes,
      };
      const updateEquipmentType: EquipmentDTO = {
        id: addEquipmentWithoutSched.id,
        name: addEquipmentWithoutSched.name,
        brand: addEquipmentWithoutSched.brand,
        type: EquipmentTypeEnum.LIVE_STREAMING,
        serial: addEquipmentWithoutSched.serial,
        notes: addEquipmentWithoutSched.notes,
      };
      const updateEquipmentSerial: EquipmentDTO = {
        id: addEquipmentWithoutSched.id,
        name: addEquipmentWithoutSched.name,
        brand: addEquipmentWithoutSched.brand,
        type: addEquipmentWithoutSched.type.toString() as EquipmentTypeEnum,
        serial: '123465',
        notes: addEquipmentWithoutSched.notes,
      };
      const updateEquipmentNotes: EquipmentDTO = {
        id: addEquipmentWithoutSched.id,
        name: addEquipmentWithoutSched.name,
        brand: addEquipmentWithoutSched.brand,
        type: addEquipmentWithoutSched.type.toString() as EquipmentTypeEnum,
        serial: addEquipmentWithoutSched.serial,
        notes: 'do not forget the lens',
      };

      await requestWithStaff
        .put(equipmentRoute + '/' + addEquipmentWithoutSched.id)
        .send(updateEquipmentName)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(equipmentRoute + '/' + addEquipmentWithoutSched.id)
        .send(updateEquipmentBrand)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(equipmentRoute + '/' + addEquipmentWithoutSched.id)
        .send(updateEquipmentType)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(equipmentRoute + '/' + addEquipmentWithoutSched.id)
        .send(updateEquipmentSerial)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(equipmentRoute + '/' + addEquipmentWithoutSched.id)
        .send(updateEquipmentNotes)
        .expect(HttpStatus.OK);
    });

    it('should not update equipment info with an id that does not exist', async () => {
      const id = '3e8e27e1-b023-40a6-a367-52ab65937d36'; //this id does not exist
      const updateEquipmentName = {
        id: addEquipmentWithoutSched.id,
        name: 'EPSON Large 3',
        brand: addEquipmentWithoutSched.brand,
        type: addEquipmentWithoutSched.type,
        serial: addEquipmentWithoutSched.serial,
        notes: addEquipmentWithoutSched.notes,
      };

      await requestWithStaff
        .put(equipmentRoute + '/' + id)
        .send(updateEquipmentName)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete an equipment', async () => {
      await requestWithStaff
        .delete(equipmentRoute + '/' + addEquipmentWithoutSched.id)
        .expect(HttpStatus.OK);
    });

    it('should not delete an equipment with an id that does not exist', async () => {
      const id = '3e8e27e1-b023-40a6-a367-52ab65937d36'; //this id does not exist

      await requestWithStaff
        .delete(equipmentRoute + '/' + id)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
