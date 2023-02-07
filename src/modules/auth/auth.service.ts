import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginDto } from '../admin/dto/admin-login.dto';
import { AdminService } from '../admin/admin.service';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { RepairmanService } from '../repairman/repairman.service';
import { HttpService } from '@nestjs/axios';
import weixinConfig from '@/common/config/weixin-config';
import { ConfigType } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repairman } from '../repairman/entities/repairman.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly repairmanService: RepairmanService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Repairman)
    private readonly repairmanRepository: Repository<Repairman>,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    @Inject(weixinConfig.KEY)
    private readonly wxConfig: ConfigType<typeof weixinConfig>,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async adminLogin(adminLoginDto: AdminLoginDto) {
    const admin = await this.adminService.login(adminLoginDto);
    return { token: this.jwtService.sign({ ...admin }), userInfo: admin };
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
      throw new BadRequestException({ error: 'Bad Request', message: data });

    // 查询user表
    let user = await this.userRepository.findOneBy({ openid });

    if (user) {
      return { token: this.jwtService.sign({ ...user }), userInfo: user };
    } else {
      // 查询repairman表
      user = await this.repairmanRepository.findOneBy({ openid });
      if (user)
        return { token: this.jwtService.sign({ ...user }), userInfo: user };
    }

    // 如果都没有，则创建用户
    if (!user) {
      user = this.userRepository.create({ openid, avatarUrl, nickname });
      user = await this.userRepository.save(user);
      delete user.deletedTime;
      return user;
    }
  }

  async loginTest({ openid, avatarUrl, nickname }: UserLoginDto) {
    // 查询user表
    let user = await this.userRepository.findOneBy({ openid });

    if (user) return user;
    else {
      // 查询repairman表
      user = await this.repairmanRepository.findOneBy({ openid });
      if (user) return user;
    }

    // 如果都没有，则创建用户
    if (!user) {
      user = this.userRepository.create({ openid, avatarUrl, nickname });
      user = await this.userRepository.save(user);
      delete user.deletedTime;
      return user;
    }
  }
}
