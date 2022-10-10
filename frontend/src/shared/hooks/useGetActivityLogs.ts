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
  const vowelRegex = '^[aeio].*';
  const createAudioElement = document.createElement('audio');
  const handleToastSocket = (data: ActivityLogDTO) => {
    createAudioElement.setAttribute('src', '/audio/notification.mp3');
    if (user?.id !== data.userId) {
      createAudioElement.play();
      const description = `${data.user.name} has ${data.action.toLowerCase()} ${
        data.action === 'ADDED' || data.action === 'REGISTERED'
          ? 'a new'
          : data.entityName.match(vowelRegex)
          ? 'an'
          : 'a'
      } ${data.entityName}`;
      toast({
        title: data.entityName.toUpperCase(),
        description,
        status: 'info',
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
