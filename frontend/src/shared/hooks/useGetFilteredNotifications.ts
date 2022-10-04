import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../providers/ApiProvider';
import { NotificationDateFilterEnum } from '../enums/notificationDateFilter';
import { NotificationsDTO } from 'generated-api';
export const useGetFilteredNotification = (
  filter: NotificationDateFilterEnum
) => {
  const api = useContext(ApiContext);
  const query = useQuery(['notification', filter], () =>
    api.getFilteredNotifications(filter)
  );
  let notificationsDTO: NotificationsDTO | undefined;

  const { data } = query;

  if (data) {
    notificationsDTO = data.data;
  }
  return {
    ...query,
    notificationsDTO,
  };
};
