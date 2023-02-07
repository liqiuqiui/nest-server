import { Module } from '@nestjs/common';
import { RepairmanService } from './repairman.service';
import { RepairmanController } from './repairman.controller';
import { Repairman } from './entities/repairman.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Repairman])],
  controllers: [RepairmanController],
  providers: [RepairmanService],
  exports: [RepairmanService],
})
export class RepairmanModule {}
