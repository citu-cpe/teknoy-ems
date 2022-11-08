import { useContext, useEffect } from 'react';
import { WebSocketEnum } from '../../../shared/enums/webSocketEnum';
import { SocketContext } from '../../../shared/providers/SocketProvider';

export const useUpdateEventsCalendar = (callback: any, refresher: boolean) => {
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket?.on(WebSocketEnum.UPDATE_EVENTS_TABLE, callback);
    return () => {
      socket?.off(WebSocketEnum.UPDATE_EVENTS_TABLE, callback);
    };
  }, [socket, refresher, callback]);
};
