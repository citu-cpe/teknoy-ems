/* tslint:disable */
/* eslint-disable */
/**
 * Teknoy EMS API
 * API for Teknoy EMS
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
 * @interface AnnouncementDTO
 */
export interface AnnouncementDTO {
  /**
   *
   * @type {string}
   * @memberof AnnouncementDTO
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof AnnouncementDTO
   */
  title: string;
  /**
   *
   * @type {string}
   * @memberof AnnouncementDTO
   */
  subtitle?: string;
  /**
   *
   * @type {string}
   * @memberof AnnouncementDTO
   */
  content: string;
  /**
   *
   * @type {Array<string>}
   * @memberof AnnouncementDTO
   */
  tags: Array<string>;
  /**
   *
   * @type {string}
   * @memberof AnnouncementDTO
   */
  viewAccess: AnnouncementDTOViewAccessEnum;
}

/**
 * @export
 * @enum {string}
 */
export enum AnnouncementDTOViewAccessEnum {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}