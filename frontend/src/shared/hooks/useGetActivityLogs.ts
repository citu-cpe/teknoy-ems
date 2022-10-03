import { ActivityLogDTO } from 'generated-api';
import { useContext, useEffect } from 'react';
import { WebSocketEnum } from '../enums/webSocketEnum';
import { SocketContext } from '../providers/SocketProvider';
import { useGlobalStore } from '../stores';
import { useToast } from './useToast';
export const useGetActivityLogs = () => {
  const socket = useContext(SocketContext);
  const user = useGlobalStore.getState().getUser();
  const toast = useToast();

  const handleToastSocket = (data: ActivityLogDTO) => {
    if (user?.id !== data.userId) {
      toast({
        title: data.entityName.toUpperCase(),
        description: `${data.user.name} has ${data.action.toLowerCase()} ${
          data.entityName
        }`,
      });
    }
  };
  useEffect(() => {
    socket?.on(WebSocketEnum.NOTIFICATIONS_ACTIVITY, handleToastSocket);
    return () => {
      socket?.off(WebSocketEnum.NOTIFICATIONS_ACTIVITY, handleToastSocket);
    };
  }, []);
};
