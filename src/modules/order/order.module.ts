import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from '../user/entities/user.entity';
import { Image } from '../../common/entities/image.entity';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Image]), AddressModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
