import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from './common/filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // 参数开启白名单
      // forbidNonWhitelisted: true, // 禁止白名单以外的参数传进来
      transform: true, //将参数自动转换成对应的类的实例
      transformOptions: {
        enableImplicitConversion: true, //启用隐式类型转换，dto中就不需要@Type装饰器了，'1' => 1
      },
    }),
  );
  // 全局拦截器
  app.useGlobalInterceptors(
    // 对响应结果进行处理的拦截器
    new TransformInterceptor(),
  );
  // 全局过滤器
  app.useGlobalFilters(
    // 异常过滤器
    new AllExceptionFilter(),
    new HttpExceptionFilter(),
  );
  // 设置路由全局前缀
  app.setGlobalPrefix('/api/v1');
  // swagger配置
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('报修管理系统api文档')
    .setDescription('报修管理系统api文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });

  SwaggerModule.setup('api-docs', app, document);
  // 读取配置
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') ?? 3000;
  await app.listen(port);

  console.log(`http://localhost:${port}/api/v1`);
  console.log(`swagger文档地址：http://localhost:${port}/api-docs`);
  console.log(
    `swagger文档json文件地址：http://localhost:${port}/api-docs-json`,
  );
}
bootstrap();
