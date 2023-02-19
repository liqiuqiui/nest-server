import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
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
import { AdminLoginDto } from './dto/admin-login.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
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

  async findAll(queryUserDto: QueryUserDto) {
    const {
      page,
      pageSize,
      name,
      // relateOrder,
      role,
      nickname,
      phone,
      startTime,
      endTime,
    } = queryUserDto;

    const builder = this.userRepository.createQueryBuilder('user');

    // BUG: 由于表连接的关系, 查询相关订单有问题
    // find order related with user/repairman
    // if (relateOrder) {
    //   switch (role) {
    //     case Role.Repairman:
    //       {
    //         builder.leftJoinAndSelect(
    //           'user.orders',
    //           'order',
    //           'order.repairmanId=user.id',
    //         );
    //       }
    //       break;
    //     case Role.User: {
    //       builder.leftJoinAndSelect(
    //         'user.orders',
    //         'order',
    //         'order.userId=user.id',
    //       );
    //     }
    //   }
    // }

    // 姓名模糊查询
    if (name) builder.andWhere('user.name like :name', { name: `%${name}%` });

    // 电话模糊查询
    if (phone)
      builder.andWhere('user.phone like :phone', { phone: `%${phone}%` });

    // 注册时间范围查询
    if (startTime)
      builder.andWhere('user.createdTime >= :startTime', { startTime });

    if (endTime) {
      endTime.setDate(endTime.getDate() + 1);
      builder.andWhere('user.createdTime <= :endTime', { endTime });
    }

    // 昵称模糊查询
    if (nickname)
      builder.andWhere('user.nickname like :nickname', {
        nickname: `%${nickname}%`,
      });

    //

    // 角色筛选
    if ([Role.Repairman, Role.User].includes(role)) {
      builder.andWhere('user.role=:role', { role });
    } else {
      builder.andWhere('user.role!=:role', { role: Role.Admin });
    }

    const [list, totalCount] = await builder
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .printSql()
      .getManyAndCount();

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
