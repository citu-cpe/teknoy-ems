/* tslint:disable */
/* eslint-disable */
/**
 * TeknoyEMS API
 * API TeknoyEMS
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface RegisterUserDTO
 */
export interface RegisterUserDTO {
  /**
   *
   * @type {string}
   * @memberof RegisterUserDTO
   */
  email: string;
  /**
   *
   * @type {string}
   * @memberof RegisterUserDTO
   */
  name: string;
  /**
   *
   * @type {Array<string>}
   * @memberof RegisterUserDTO
   */
  roles: Array<RegisterUserDTORolesEnum>;
  /**
   *
   * @type {string}
   * @memberof RegisterUserDTO
   */
  password?: string;
}

/**
 * @export
 * @enum {string}
 */
export enum RegisterUserDTORolesEnum {
  Admin = 'ADMIN',
  Staff = 'STAFF',
  Organizer = 'ORGANIZER',
}
