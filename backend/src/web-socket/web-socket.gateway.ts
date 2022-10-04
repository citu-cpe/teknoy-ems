import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;

  public handleConnection(socket: Socket) {
    const userId = socket.handshake.headers.userid as string;

    if (!!userId && userId !== 'undefined') {
      socket.join(userId);
    }
  }

  public handleDisconnect(socket: Socket) {
    const userId = socket.handshake.headers.userid as string;

    if (!!userId && userId !== 'undefined') {
      socket.leave(userId);
    }
  }
}
