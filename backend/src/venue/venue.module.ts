import { Module } from '@nestjs/common';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';

@Module({
  providers: [VenueService],
  exports: [VenueService],
  controllers: [VenueController],
})
export class VenueModule {}
