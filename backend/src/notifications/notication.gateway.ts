import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketEnum } from '../web-socket/enum/web-socket.enum';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  public server: Server;

  @SubscribeMessage(WebSocketEnum.NOTIFICATION)
  public handleNotification(@ConnectedSocket() client: Socket) {
    const clientId = client.handshake.headers.userid;

    if (!!clientId && clientId !== 'undefined') {
      this.server.emit(WebSocketEnum.NOTIFICATION, clientId);
    }
  }
}
