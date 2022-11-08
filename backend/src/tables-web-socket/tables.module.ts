import { Module } from '@nestjs/common';
import { TablesWebSocketGateway } from './tables.gateway';

@Module({
  providers: [TablesWebSocketGateway],
  exports: [TablesWebSocketGateway],
})
export class TablesModule {}
