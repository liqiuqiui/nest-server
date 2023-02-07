import {
  Controller,
  Get,
  Body,
  Patch,
  Query,
  Put,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { Role } from '@/common/enum/role.enum';
import { User } from './entities/user.entity';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiPaginatedResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
  Auth,
} from '@/common/decorators';
import { SwitchRoleDto } from './dto/switch-role.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiPaginatedResponse(User)
  @ApiOperation({ summary: '分页查询用户' })
  @Auth(Role.Admin)
  @Get('')
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.userService.findAll(paginationQueryDto);
  }

  @ApiOperation({ summary: '用户登陆' })
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
              $ref: getSchemaPath(User),
            },
          },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() userLoginDto: UserLoginDto) {
    return this.userService.login(userLoginDto);
  }

  @ApiOperation({ summary: '管理员登陆' })
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
              $ref: getSchemaPath(User),
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse('incorrect username or password')
  @HttpCode(HttpStatus.OK)
  @Post('/login/admin')
  adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return this.userService.adminLogin(adminLoginDto);
  }

  @ApiResponse(User)
  @ApiOperation({ summary: '更新账户信息' })
  @Auth(Role.User, Role.Repairman)
  // @Patch('')
  @Put('')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @ApiBadRequestResponse()
  @ApiResponse(User)
  @ApiOperation({ summary: '角色转换' })
  @Patch('/switchRole')
  @Put('/switchRole')
  @Auth(Role.Admin)
  switchRole(@Body() switchRoleDto: SwitchRoleDto) {
    return this.userService.switchRole(switchRoleDto);
  }
}
