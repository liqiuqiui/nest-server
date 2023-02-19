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
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
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
import { QueryUserDto } from './dto/query-user.dto';

@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiPaginatedResponse(User)
  @ApiOperation({ summary: '分页查询用户', operationId: 'getAllUser' })
  @ApiQuery({ required: false })
  @Auth(Role.Admin)
  @Get('')
  findAll(@Query() queryUserDto: QueryUserDto) {
    return this.userService.findAll(queryUserDto);
  }

  @ApiOperation({ summary: '用户登陆', operationId: 'userLogin' })
  @ApiOkResponse({
    schema: {
      title: `ResponseOfAdminLogin`,
      required: ['code', 'message', 'data'],
      properties: {
        code: { type: 'number', default: 200 },
        message: { type: 'string', default: 'success' },
        data: {
          required: ['token', 'userInfo'],
          properties: {
            token: { type: 'string' },
            userInfo: {
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

  @ApiOperation({ summary: '管理员登陆', operationId: 'adminLogin' })
  @ApiOkResponse({
    schema: {
      title: `ResponseOfAdminLogin`,
      required: ['code', 'message', 'data'],
      properties: {
        code: { type: 'number', default: 200 },
        message: { type: 'string', default: 'success' },
        data: {
          required: ['token', 'userInfo'],
          properties: {
            token: { type: 'string' },
            userInfo: {
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
  @ApiOperation({ summary: '更新账户信息', operationId: 'updateUserInfo' })
  @Auth()
  // @Patch('')
  @Put('')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @ApiBadRequestResponse()
  @ApiResponse(User)
  @ApiOperation({ summary: '角色转换', operationId: 'switchRole' })
  @Patch('/switchRole')
  @Put('/switchRole')
  @Auth(Role.Admin)
  switchRole(@Body() switchRoleDto: SwitchRoleDto) {
    return this.userService.switchRole(switchRoleDto);
  }
}
