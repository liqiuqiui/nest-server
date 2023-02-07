import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { OrderModule } from '../order/order.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    OrderModule,
    TypeOrmModule.forFeature([User]),
    AuthModule,
    HttpModule.register({
      timeout: 5000,
      baseURL: 'https://api.weixin.qq.com',
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
