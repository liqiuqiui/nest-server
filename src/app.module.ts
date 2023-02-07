import { Module } from '@nestjs/common';
import { resolve } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './modules/order/order.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeModule } from './modules/notice/notice.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { RepairmanModule } from './modules/repairman/repairman.module';
import { AddressModule } from './modules/address/address.module';
import { UploadModule } from './modules/upload/upload.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import wxConfig from './common/config/weixin-config';
import * as Joi from 'joi';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '../static'),
      serveRoot: '/static',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [wxConfig],
      validationSchema: Joi.object<NodeJS.ProcessEnv>({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().default(3306),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      timezone: '+08:00',
    }),
    UserModule,
    OrderModule,
    NoticeModule,
    AdminModule,
    AuthModule,
    RepairmanModule,
    AddressModule,
    UploadModule,
    FeedbackModule,
  ],
})
export class AppModule {}
