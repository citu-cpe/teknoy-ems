import moment from 'moment';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { Schedule } from '../../../shared/types';
import { useSchedule } from './useSchedule';

export const useGetSortedEquipments = () => {
  const api = useContext(ApiContext);

  const { startTimeField, endTimeField } = useSchedule();

  const getSortedEquipments = useMutation((schedule: Schedule) =>
    api.getSortedEquipments(schedule)
  );

  return {
    startTimeField,
    endTimeField,
    schedule: {
      startTime: moment(startTimeField.value).toISOString(),
      endTime: moment(endTimeField.value).toISOString(),
    },
    getSortedEquipments,
  };
};
