import { HttpStatus } from '@nestjs/common';
import { requestWithStaff } from '../setup';
import {
  testOrganizerDepartment,
  testOrganizerOrganization,
} from '../../../src/global/test-data/organizer-test-data.service';
import {
  OrganizerDTO,
  TypeEnum,
} from '../../../src/organizer/dto/organizer.dto';
import { OrganizerController } from '../../../src/organizer/organizer.controller';
import {
  createOrganizerDept,
  createOrganizerOrg,
  testCreateOrganizerDept,
  testCreateOrganizerDeptSameName,
  testCreateOrganizerOrg,
  testCreateOrganizerOrgSameName,
  uncreatedOrganizerDept,
  uncreatedOrganizerOrg,
} from '../fixtures/organizer.fixtures';
import { Type } from '@prisma/client';

describe('organizer.spec.ts - Organizer Controller', () => {
  const organizerRoute = OrganizerController.ORGANIZER_API_PATH;

  describe('POST /organizer', () => {
    it('should successfully create a dept type organizer', async () => {
      const { name, type }: OrganizerDTO = await createOrganizerDept(
        testCreateOrganizerDept
      );

      expect(name).toEqual(testCreateOrganizerDept.name);
      expect(type).toEqual(testCreateOrganizerDept.type);
    });

    it('should successfully create an org type organizer', async () => {
      const { name, type }: OrganizerDTO = await createOrganizerOrg(
        testCreateOrganizerOrg
      );

      expect(name).toEqual(testCreateOrganizerOrg.name);
      expect(type).toEqual(testCreateOrganizerOrg.type);
    });

    it('should not create a dept type organizer with missing data', async () => {
      const createDeptOrganizerWithoutName = {
        type: TypeEnum.DEPARTMENT,
      };
      const createDeptOrganizerWithoutType = {
        name: 'Christopher Lao',
      };
      const createDeptOrganizerWithEmptyData = {};

      await requestWithStaff
        .post(organizerRoute)
        .send(createDeptOrganizerWithoutName)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(organizerRoute)
        .send(createDeptOrganizerWithoutType)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(organizerRoute)
        .send(createDeptOrganizerWithEmptyData)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create an org type organizer with missing data', async () => {
      const createOrgOrganizerWithoutName = {
        type: TypeEnum.ORGANIZATION,
      };
      const createOrgOrganizerWithoutType = {
        name: 'Keanue Dax Teaño',
      };
      const createOrgOrganizerWithEmptyData = {};

      await requestWithStaff
        .post(organizerRoute)
        .send(createOrgOrganizerWithoutName)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(organizerRoute)
        .send(createOrgOrganizerWithoutType)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .post(organizerRoute)
        .send(createOrgOrganizerWithEmptyData)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should not create a dept type organizer with the same dept name', async () => {
      const { name, type }: OrganizerDTO = await uncreatedOrganizerDept(
        testCreateOrganizerDeptSameName
      );

      expect(name).toEqual(testCreateOrganizerDeptSameName.name);
      expect(type).toEqual(testCreateOrganizerDeptSameName.type);
    });

    it('should not create an org type organizer with the same org name', async () => {
      const { name, type }: OrganizerDTO = await uncreatedOrganizerOrg(
        testCreateOrganizerOrgSameName
      );

      expect(name).toEqual(testCreateOrganizerOrgSameName.name);
      expect(type).toEqual(testCreateOrganizerOrgSameName.type);
    });
  });

  describe('GET /', () => {
    it('should get all organizer', async () => {
      await requestWithStaff.get(organizerRoute).expect(HttpStatus.OK);
    });
  });

  describe('GET /:id', () => {
    it('should get organizer by id', async () => {
      const deptId = testOrganizerDepartment.id;
      const orgId = testOrganizerOrganization.id;

      await requestWithStaff
        .get(organizerRoute + '/' + deptId)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .get(organizerRoute + '/' + orgId)
        .expect(HttpStatus.OK);
    });

    it('should not get organizer with id that does not exist', async () => {
      const deptId = '6ee07e9c-daa6-4d13-a96a-91a64d380a2f'; //this id does not exist
      const orgId = '906e7fb5-67ac-4632-9c4b-6721833f1265'; //this id does not exist

      await requestWithStaff
        .get(organizerRoute + '/' + deptId)
        .expect(HttpStatus.NOT_FOUND);

      await requestWithStaff
        .get(organizerRoute + '/' + orgId)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /:id', () => {
    it('should update organizer info', async () => {
      //UPDATES ORGANIZER INFO WITH DEPARTMENT TYPE
      const updateOrganizerDeptName = {
        id: testOrganizerDepartment.id,
        name: 'Chris Law',
        type: testOrganizerDepartment.type,
      };
      const updateOrganizerDeptType = {
        id: testOrganizerDepartment.id,
        name: testOrganizerDepartment.name,
        type: Type.ORGANIZATION,
      };
      const updateOrganizerDeptAllInfo = {
        id: testOrganizerDepartment.id,
        name: 'CEA',
        type: Type.ORGANIZATION,
      };

      //UPDATES ORGANIZER INFO WITH ORGANIZATION TYPE
      const updateOrganizerOrgName = {
        id: testOrganizerOrganization.id,
        name: 'Patrek Mands',
        type: testOrganizerOrganization.type,
      };
      const updateOrganizerOrgType = {
        id: testOrganizerOrganization.id,
        name: testOrganizerOrganization.name,
        type: Type.DEPARTMENT,
      };
      const updateOrganizerOrgAllInfo = {
        id: testOrganizerOrganization.id,
        name: 'SSC',
        type: Type.DEPARTMENT,
      };

      await requestWithStaff
        .put(organizerRoute + '/' + testOrganizerDepartment.id)
        .send(updateOrganizerDeptName)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(organizerRoute + '/' + testOrganizerDepartment.id)
        .send(updateOrganizerDeptType)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(organizerRoute + '/' + testOrganizerDepartment.id)
        .send(updateOrganizerDeptAllInfo)
        .expect(HttpStatus.OK);

      await requestWithStaff
        .put(organizerRoute + '/' + testOrganizerOrganization.id)
        .send(updateOrganizerOrgName)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(organizerRoute + '/' + testOrganizerOrganization.id)
        .send(updateOrganizerOrgType)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .put(organizerRoute + '/' + testOrganizerOrganization.id)
        .send(updateOrganizerOrgAllInfo)
        .expect(HttpStatus.OK);
    });

    it('should not update organizer info with id that does not exist', async () => {
      const updateOrganizerDeptWrongId = {
        id: '6ee07e9c-daa6-4d13-a96a-91a64d380a2f',
        name: 'CEA',
        type: testOrganizerDepartment.type,
      };
      await requestWithStaff
        .put(organizerRoute + '/' + updateOrganizerDeptWrongId.id)
        .send(updateOrganizerDeptWrongId)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete an organizer', async () => {
      await requestWithStaff
        .delete(organizerRoute + '/' + testOrganizerDepartment.id)
        .expect(HttpStatus.OK);
      await requestWithStaff
        .delete(organizerRoute + '/' + testOrganizerOrganization.id)
        .expect(HttpStatus.OK);
    });

    it('should not delete an organizer with id that does not exist', async () => {
      const deptId = '6ee07e9c-daa6-4d13-a96a-91a64d380a2f'; //this id does not exist
      const orgId = '906e7fb5-67ac-4632-9c4b-6721833f1265'; //this id does not exist

      await requestWithStaff
        .delete(organizerRoute + '/' + deptId)
        .expect(HttpStatus.BAD_REQUEST);
      await requestWithStaff
        .delete(organizerRoute + '/' + orgId)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
