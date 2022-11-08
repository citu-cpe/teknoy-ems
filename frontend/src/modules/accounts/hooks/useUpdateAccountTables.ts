import { useContext, useEffect } from 'react';
import { WebSocketEnum } from '../../../shared/enums/webSocketEnum';
import { SocketContext } from '../../../shared/providers/SocketProvider';

export const useUpdateAccountTables = (callback: any, refresher: boolean) => {
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket?.on(WebSocketEnum.UPDATE_ACCOUNTS_TABLE, callback);
    return () => {
      socket?.off(WebSocketEnum.UPDATE_ACCOUNTS_TABLE, callback);
    };
  }, [socket, refresher, callback]);
};
