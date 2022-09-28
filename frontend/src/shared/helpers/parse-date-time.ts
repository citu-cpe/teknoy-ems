import moment from 'moment';

/**
 * helper function for parsing `DateTime` format from moment objects
 * to be specifically used in type datetime-local HTML inputs
 */
export const parseDateTime = (dateTime: string | undefined): string => {
  if (dateTime == undefined) {
    return '';
  }

  var dateTimeUTC = moment.utc(dateTime);

  var localDate = moment(dateTimeUTC).local();

  // adding `T` between year and time allows proper for HTML input value
  var dateTimeFormatted = localDate.format('YYYY-MM-DDTHH:mm');

  return dateTimeFormatted;
};
