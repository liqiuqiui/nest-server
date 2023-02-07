import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module';
import { JwtStrategy } from '@/common/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '@/common/constants/jwt.constant';
import { RepairmanModule } from '../repairman/repairman.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repairman } from '../repairman/entities/repairman.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Repairman]),
    UserModule,
    RepairmanModule,
    AdminModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10h' },
    }),
    HttpModule.register({
      timeout: 5000,
      baseURL: 'https://api.weixin.qq.com',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
