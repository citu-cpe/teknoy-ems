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

import { ErrorFieldDTO } from './error-field-dto';

/**
 *
 * @export
 * @interface ValidationErrorDTO
 */
export interface ValidationErrorDTO {
  /**
   *
   * @type {boolean}
   * @memberof ValidationErrorDTO
   */
  hasErrors: boolean;
  /**
   *
   * @type {Array<ErrorFieldDTO>}
   * @memberof ValidationErrorDTO
   */
  errorFields: Array<ErrorFieldDTO>;
}
