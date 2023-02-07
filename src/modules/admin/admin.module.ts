import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { User } from '../user/entities/user.entity';
import { Repairman } from '../repairman/entities/repairman.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, User, Repairman])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
