import { Module } from '@nestjs/common';
import { WebSocketsGateway } from './web-socket.gateway';

@Module({ providers: [WebSocketsGateway], exports: [WebSocketsGateway] })
export class WebSocketsModule {}
