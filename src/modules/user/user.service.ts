import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import xlsx from 'node-xlsx';
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
import { UserRegisterDto } from './dto/user-register.dto';

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
    console.log('queryUserDto', queryUserDto);

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
      registerState,
      userNo,
      academyName,
      majorNo,
      majorName,
      classNo,
      className,
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

    // 学工号模糊查询
    if (userNo)
      builder.andWhere('user.userNo like :userNo', {
        userNo: `%${userNo}%`,
      });

    // 学院名称模糊查询
    if (academyName)
      builder.andWhere('user.academyName like :academyName', {
        academyName: `%${academyName}%`,
      });

    // 专业编号模糊查询
    if (majorNo)
      builder.andWhere('user.majorNo like :majorNo', {
        majorNo: `%${majorNo}%`,
      });

    // 学院名称模糊查询
    if (majorName)
      builder.andWhere('user.majorName like :majorName', {
        majorName: `%${majorName}%`,
      });

    // 学院名称模糊查询
    if (classNo)
      builder.andWhere('user.classNo like :classNo', {
        classNo: `%${classNo}%`,
      });

    // 学院名称模糊查询
    if (className)
      builder.andWhere('user.className like :className', {
        className: `%${className}%`,
      });

    // 电话模糊查询
    if (phone)
      builder.andWhere('user.phone like :phone', { phone: `%${phone}%` });

    // 昵称模糊查询
    if (nickname)
      builder.andWhere('user.nickname like :nickname', {
        nickname: `%${nickname}%`,
      });

    // 注册状态筛选
    if (typeof registerState === 'number')
      builder.andWhere('user.registerState=:registerState', { registerState });

    // 注册时间范围查询
    if (startTime)
      builder.andWhere('user.createdTime >= :startTime', { startTime });

    if (endTime) {
      endTime.setDate(endTime.getDate() + 1);
      builder.andWhere('user.createdTime <= :endTime', { endTime });
    }

    //

    // 角色筛选
    if ([Role.Repairman, Role.User].includes(role)) {
      builder.andWhere('user.role=:role', { role });
      builder.andWhere('user.registerState=:registerState', {
        registerState: 1,
      });
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

  private async code2openid(code: string) {
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
    if (data.errcode)
      throw new BadRequestException({
        error: 'Bad Request',
        message: data,
      });
    return data.openid;
  }

  async register(userRegisterDto: UserRegisterDto) {
    const { userNo, code, avatarUrl, nickname } = userRegisterDto;

    // 使用code和微信服务器换取openid
    const openid = await this.code2openid(code);

    // 根据openid查询用户是否注册过
    let user = await this.userRepository.findOneBy({ openid });

    if (user) throw new BadRequestException('账号已注册');

    // 根据学工/号查询出用户基本信息
    user = await this.userRepository.findOneBy({ userNo });

    if (user) throw new BadRequestException('学/工号错误');

    // 调用userRepo的save方法，将用户注册信息更新进去
    user = await this.userRepository.save({
      ...user,
      openid,
      avatarUrl,
      nickname,
      registerState: 1,
    });

    // 删除多余信息
    delete user.password;
    delete user.username;
    delete user.deletedTime;

    // 签发token并返回账户信息
    return { token: this.authService.sign(user), userInfo: user };
  }

  async login({ code }: UserLoginDto) {
    const openid = await this.code2openid(code);

    const user = await this.userRepository.findOneBy({ openid });

    if (!user) {
      throw new BadRequestException('账号未注册');
    }

    delete user.password;
    delete user.username;
    delete user.deletedTime;

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

  async import(file: Express.Multer.File) {
    const [workSheet1] = xlsx.parse(file.buffer);
    const sheetData = workSheet1.data;
    const sheetHead = sheetData[0];
    if (
      sheetHead[0] !== '姓名' ||
      sheetHead[1] !== '学/工号' ||
      sheetHead[2] !== '学院名称' ||
      sheetHead[3] !== '专业名称' ||
      sheetHead[4] !== '专业编号' ||
      sheetHead[5] !== '班级名称' ||
      sheetHead[6] !== '班级编号' ||
      sheetHead[7] !== '联系电话'
    )
      throw new BadRequestException('excel解析失败, 请检查格式后重试');
    const userList = await Promise.all(
      sheetData.slice(1).map(async user => {
        const userEntity = {
          name: user[0],
          userNo: user[1],
          academyName: user[2],
          majorName: user[3],
          majorNo: user[4],
          className: user[5],
          classNo: user[6],
          phone: user[7],
        };
        const existUser = await this.userRepository.findOneBy({
          userNo: userEntity.userNo,
        });

        return existUser ? existUser : this.userRepository.create(userEntity);
      }),
    );
    return this.userRepository.save(userList);
  }

  async match(userNo: string) {
    const user = await this.userRepository.findOneBy({ userNo });
    if (!user) throw new NotFoundException('信息匹配失败');
    return user;
  }
}
