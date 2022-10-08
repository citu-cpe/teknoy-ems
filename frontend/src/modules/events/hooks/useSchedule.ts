import { useField } from 'formik';

/**
 * Special custom hook that uses startTime, and endTime fields of an `Event` form
 * @returns an object containing `startTime`, `endTime` Formik fields
 */
export const useSchedule = () => {
  const [startTimeField] = useField('startTime');
  const [endTimeField] = useField('endTime');

  return { startTimeField, endTimeField };
};
