import React, { createContext, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import io, { Socket } from 'socket.io-client';
import { WebSocketEnum } from '../enums/webSocketEnum';
import { useGlobalStore } from '../stores';
import { socketURL } from './ApiProvider';

export const SocketContext = createContext<Socket | undefined>(undefined);

export const SocketProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [socket, setSocket] = useState<Socket | undefined>();
  const queryClient = useQueryClient();
  useEffect(() => {
    const user = useGlobalStore.getState().getUser();
    const newSocket = io(socketURL, {
      transportOptions: {
        polling: {
          extraHeaders: {
            userId: user?.id,
          },
        },
      },
    });
    setSocket(newSocket);
    newSocket.on(WebSocketEnum.NOTIFICATION, () => {
      queryClient.invalidateQueries('notification');
    });
    return () => {
      newSocket.close();
    };
  }, [setSocket, queryClient]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
