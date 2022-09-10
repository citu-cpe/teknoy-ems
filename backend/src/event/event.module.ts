import { Module } from '@nestjs/common';
import { EquipmentModule } from '../equipment/equipment.module';
import { VenueModule } from '../venue/venue.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  providers: [EventService],
  exports: [EventService],
  imports: [EquipmentModule, VenueModule],
  controllers: [EventController],
})
export class EventModule {}
