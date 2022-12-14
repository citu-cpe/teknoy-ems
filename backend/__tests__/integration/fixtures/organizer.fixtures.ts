import { HttpStatus } from '@nestjs/common';
import { OrganizerController } from '../../../src/organizer/organizer.controller';
import {
  OrganizerDTO,
  TypeEnum,
} from '../../../src/organizer/dto/organizer.dto';
import { requestWithStaff } from '../setup';
import { TEST_DATA_PREFIX } from '../../../src/shared/constants/test-data-prefix';

const organizerRoute = OrganizerController.ORGANIZER_API_PATH;

export const testCreateOrganizerDept: OrganizerDTO = {
  name: 'CEA',
  type: TypeEnum.DEPARTMENT,
};

export const testCreateOrganizerDeptSameName: OrganizerDTO = {
  name: TEST_DATA_PREFIX + 'MSDO',
  type: TypeEnum.DEPARTMENT,
};

export const testCreateOrganizerOrg: OrganizerDTO = {
  name: 'NAS',
  type: TypeEnum.ORGANIZATION,
};

export const testCreateOrganizerOrgSameName: OrganizerDTO = {
  name: TEST_DATA_PREFIX + 'Supreme Student Government',
  type: TypeEnum.ORGANIZATION,
};

export const createOrganizerDept = async (
  dto: OrganizerDTO
): Promise<OrganizerDTO> => {
  const { body } = await requestWithStaff
    .post(organizerRoute)
    .send(dto)
    .expect(HttpStatus.CREATED);

  return body;
};

export const uncreatedOrganizerDept = async (
  dto: OrganizerDTO
): Promise<OrganizerDTO> => {
  const { body } = await requestWithStaff
    .post(organizerRoute)
    .send(dto)
    .expect(HttpStatus.BAD_REQUEST);

  return body;
};

export const createOrganizerOrg = async (
  dto: OrganizerDTO
): Promise<OrganizerDTO> => {
  const { body } = await requestWithStaff
    .post(organizerRoute)
    .send(dto)
    .expect(HttpStatus.CREATED);

  return body;
};

export const uncreatedOrganizerOrg = async (
  dto: OrganizerDTO
): Promise<OrganizerDTO> => {
  const { body } = await requestWithStaff
    .post(organizerRoute)
    .send(dto)
    .expect(HttpStatus.BAD_REQUEST);

  return body;
};
