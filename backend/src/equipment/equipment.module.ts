import { Module } from '@nestjs/common';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';

@Module({
  providers: [EquipmentService],
  exports: [EquipmentService],
  controllers: [EquipmentController],
})
export class EquipmentModule {}
