import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketEnum } from '../web-socket/enum/web-socket.enum';

@WebSocketGateway({ cors: true })
export class TablesWebSocketGateway {
  @WebSocketServer()
  public server: Server;

  @SubscribeMessage(WebSocketEnum.UPDATE_TABLES)
  public handleNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string
  ) {
    const clientId = client.handshake.headers.userid;

    if (!!clientId && clientId !== 'undefined') {
      if (data === 'EQUIPMENT') {
        this.server.emit(WebSocketEnum.UPDATE_EQUIPMENTS_TABLE, clientId);
      } else if (data === 'EVENT') {
        this.server.emit(WebSocketEnum.UPDATE_EVENTS_TABLE, clientId);
      } else if (data === 'ANNOUNCEMENT') {
        this.server.emit(WebSocketEnum.UPDATE_ANNOUNCEMENTS_TABLE, clientId);
      } else if (data === 'ACCOUNT') {
        this.server.emit(WebSocketEnum.UPDATE_ACCOUNTS_TABLE, clientId);
      } else if (data === 'ORGANIZER') {
        this.server.emit(WebSocketEnum.UPDATE_ORGANIZERS_TABLE, clientId);
      } else if (data === 'VENUE') {
        this.server.emit(WebSocketEnum.UPDATE_VENUES_TABLE, clientId);
      }
    }
  }
}
