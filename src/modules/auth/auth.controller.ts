import { ApiNotFoundResponse } from '@/common/decorators/api-not-found-response.decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AdminLoginDto } from '../admin/dto/admin-login.dto';
import { Admin } from '../admin/entities/admin.entity';
import { UserLoginDto } from '../user/dto/user-login.dto';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';

@ApiTags('验证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '管理员登录' })
  @ApiExtraModels(Admin)
  @ApiOkResponse({
    schema: {
      title: `ResponseOfAdminLogin`,
      required: ['code', 'message', 'data'],
      properties: {
        code: { type: 'number', default: 200 },
        message: { type: 'string', default: 'success' },
        data: {
          required: ['token', 'admin'],
          properties: {
            token: { type: 'string' },
            admin: {
              $ref: getSchemaPath(Admin),
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse('incorrect username or password')
  @HttpCode(HttpStatus.OK)
  @Post('login/admin')
  adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return this.authService.adminLogin(adminLoginDto);
  }

  @ApiOperation({ summary: '登录' })
  @ApiExtraModels(User)
  @ApiOkResponse({
    schema: {
      title: `ResponseOfUserLogin`,
      required: ['code', 'message', 'data'],
      properties: {
        code: { type: 'number', default: 200 },
        message: { type: 'string', default: 'success' },
        data: {
          required: ['token', 'user'],
          properties: {
            token: { type: 'string' },
            user: {
              $ref: getSchemaPath(User),
            },
          },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  Login(@Body() loginDto: UserLoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: '登录(test)' })
  @ApiExtraModels(User)
  @ApiOkResponse({
    schema: {
      title: `ResponseOfUserLogin`,
      required: ['code', 'message', 'data'],
      properties: {
        code: { type: 'number', default: 200 },
        message: { type: 'string', default: 'success' },
        data: {
          required: ['token', 'user'],
          properties: {
            token: { type: 'string' },
            user: {
              $ref: getSchemaPath(User),
            },
          },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('login/test')
  userLoginTest(@Body() loginDto: UserLoginDto) {
    return this.authService.loginTest(loginDto);
  }
}
