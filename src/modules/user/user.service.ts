import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import weixinConfig from '@/common/config/weixin-config';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { UserLoginDto } from './dto/user-login.dto';
import { SwitchRoleDto } from './dto/switch-role.dto';
import { AuthService } from '../auth/auth.service';
import { Role } from '@/common/enum/role.enum';
import { Logger } from '@/common/utils/logger';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class UserService implements OnApplicationBootstrap, OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(REQUEST)
    private readonly req: Request & { user: User },
    private readonly httpService: HttpService,
    @Inject(weixinConfig.KEY)
    private readonly wxConfig: ConfigType<typeof weixinConfig>,
    private readonly authService: AuthService,
  ) {}
  onModuleInit() {
    this.logger.log('user模块初始化成功');
  }
  private readonly logger = new Logger(UserService.name);

  // nest生命周期函数，应用启动的时候创建默认的管理员账户
  async onApplicationBootstrap() {
    console.log('userservice 生命周期函数');

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

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const { page, pageSize } = paginationQueryDto;
    const [list, totalCount] = await this.userRepository.findAndCount({
      skip: pageSize * (page - 1),
      take: pageSize,
    });
    const totalPage = Math.ceil(totalCount / pageSize);
    return {
      list,
      pagination: {
        totalCount,
        totalPage,
        pageSize,
        curentPage: page,
      },
    };
  }

  async login({ code, avatarUrl, nickname }: UserLoginDto) {
    const { data } = await firstValueFrom(
      this.httpService.get<WxLoginRes>('/sns/jscode2session', {
        params: {
          js_code: code,
          appid: this.wxConfig.appid,
          secret: this.wxConfig.secret,
          grant_type: 'authorization_code',
        },
      }),
    );
    const { errcode, openid } = data;
    // 当有errcode时候，登陆失败
    if (errcode)
      throw new BadRequestException({
        error: 'Bad Request',
        message: data,
      });

    let user = await this.userRepository.findOneBy({ openid });
    // 如果有，直接返回账户信息

    if (!user) {
      // 如果都没有，则创建用户
      user = this.userRepository.create({ openid, avatarUrl, nickname });
      user = await this.userRepository.save(user);
      delete user.deletedTime;
    }

    if (user.role === Role.Admin) {
      delete user.openid;
    }

    if ([Role.Admin, Role.Repairman].includes(user.role)) {
      delete user.password;
      delete user.username;
    }
    // 签发token并返回账户信息
    return { token: this.authService.sign(user), userInfo: user };
  }

  async adminLogin(adminLogin: AdminLoginDto) {
    const admin = await this.userRepository.findOneBy({ ...adminLogin });
    if (!admin) throw new NotFoundException('username or password incorrect');
    return {
      token: this.authService.sign({ ...admin }),
      userInfo: admin,
    };
  }

  async update(updateUserDto: UpdateUserDto) {
    const loginUser = this.req.user as User;

    const user = await this.userRepository.preload({
      id: loginUser.id,
      ...updateUserDto,
    });
    if (user) return this.userRepository.save(user);
    throw new NotFoundException(`user #id=${loginUser.id} not found`);
  }

  async switchRole(switchRoleDto: SwitchRoleDto) {
    const { openid, fromRole, toRole } = switchRoleDto;
    let user = await this.userRepository.findOneBy({ role: fromRole, openid });
    if (!user)
      throw new NotFoundException(
        `the account with openid=${openid} and role=${fromRole} not found`,
      );

    user = await this.userRepository.save({ ...user, role: toRole });
    return user;
  }
}
