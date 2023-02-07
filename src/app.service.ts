import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './common/enum/role.enum';
import { User } from './modules/user/entities/user.entity';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(AppService.name);

  // nest生命周期函数，应用启动的时候创建默认的管理员账户
  // NOTE: 注入过REQUEST作用域的类中的生命周期不会触发
  async onApplicationBootstrap() {
    const res = await this.userRepository.countBy({ role: Role.Admin });
    if (res === 0) {
      const admin = this.userRepository.create({
        username: 'admin',
        password: '123456',
        role: Role.Admin,
      });

      this.userRepository.save(admin);
      this.logger.log('admin账户初始化成功');
    } else {
      this.logger.log('admin账户已存在');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
