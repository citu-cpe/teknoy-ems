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

import { ScheduleDTO } from './schedule-dto';

/**
 *
 * @export
 * @interface VenueDTO
 */
export interface VenueDTO {
  /**
   *
   * @type {string}
   * @memberof VenueDTO
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof VenueDTO
   */
  createdAt?: string;
  /**
   *
   * @type {string}
   * @memberof VenueDTO
   */
  updatedAt?: string;
  /**
   *
   * @type {string}
   * @memberof VenueDTO
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof VenueDTO
   */
  notes?: string;
  /**
   *
   * @type {Array<ScheduleDTO>}
   * @memberof VenueDTO
   */
  schedule?: Array<ScheduleDTO>;
}
