import { Role } from '@/common/enum/role.enum';
import { Logger } from '@/common/utils/logger';
import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repairman } from '../repairman/entities/repairman.entity';
import { User } from '../user/entities/user.entity';
import { AdminLoginDto } from './dto/admin-login.dto';
import { SwitchRoleDto } from './dto/switch-role.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Repairman)
    private readonly repairmanRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(AdminService.name);

  // nest生命周期函数，应用启动的时候创建默认的管理员账户
  async onApplicationBootstrap() {
    const res = await this.adminRepository.count();
    if (res < 1) {
      const admin = await this.adminRepository.create({
        username: 'admin',
        password: '123456',
      });

      this.adminRepository.save(admin);
      this.logger.log('admin账户初始化成功');
    } else {
      this.logger.log('admin账户已存在');
    }
  }

  async login(adminLoginDto: AdminLoginDto) {
    const admin = await this.adminRepository.findOneBy(adminLoginDto);

    if (!admin) throw new NotFoundException('incorrect username or password');
    return admin;
  }

  async switchRole(switchRoleDto: SwitchRoleDto) {
    const { openid, fromRole, toRole } = switchRoleDto;

    let account: User & Repairman;
    let result: User & Repairman;

    if (fromRole === Role.User) {
      account = await this.userRepository.findOneBy({ openid });

      if (account) {
        delete account.updatedTime;
        result = await this.repairmanRepository.save({
          ...account,
          role: toRole,
        });
      }
    } else {
      account = await this.repairmanRepository.findOneBy({ openid });

      if (account) {
        delete account.updatedTime;
        result = await this.userRepository.save({ ...account, role: toRole });
      }
    }

    if (account) {
      if (fromRole === Role.User) {
        await this.userRepository.remove(account);
      } else {
        await this.repairmanRepository.remove(account);
      }
      return result;
    } else
      throw new NotFoundException(
        `the account with openid=${openid} and role=${fromRole} not found`,
      );
  }
}
