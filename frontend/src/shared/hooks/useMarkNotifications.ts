import { NotificationDTO } from 'generated-api';
import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { ApiContext } from '../providers/ApiProvider';

export const useMarkNotificationasRead = () => {
  const api = useContext(ApiContext);
  const queryClient = useQueryClient();

  const markNotificationAsRead = useMutation(
    (notification: NotificationDTO) => api.markNotificationAsRead(notification),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notification');
      },
    }
  );
  const markAllNotificationsAsRead = useMutation(
    () => api.markAllNotificationsAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notification');
      },
    }
  );

  return {
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };
};
