import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  private readonly logger = new Logger(AppService.name);

  onApplicationBootstrap() {
    const res = this.dataSource.query('select count(*) from admin');
    this.logger.log(JSON.stringify(res), 'appservice');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
