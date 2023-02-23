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
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
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
  ApiResponseArray,
  ApiUnauthorizedResponse,
  Auth,
} from '@/common/decorators';
import { SwitchRoleDto } from './dto/switch-role.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportUserDto } from './dto/import-userDto';
import { UserRegisterDto } from './dto/user-register.dto';

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
      title: `ResponseOfUserLogin`,
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

  @ApiOperation({ summary: '用户注册', operationId: 'userRegister' })
  @ApiOkResponse({
    schema: {
      title: `ResponseOfUserRegister`,
      required: ['code', 'message', 'data'],
      properties: {
        code: { type: 'number', default: 201 },
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
  @Post('/register')
  register(@Body() userRegisterDto: UserRegisterDto) {
    return this.userService.register(userRegisterDto);
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

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'multipart/form-data for file upload',
    type: ImportUserDto,
  })
  @ApiBadRequestResponse()
  @ApiResponseArray(User)
  @ApiOperation({
    summary: '导入用户',
    operationId: 'importUser',
    description: '姓名	学/工号	学院名称	专业名称	专业编号	班级名称	班级编号',
  })
  @Auth(Role.Admin)
  @Post('/import')
  @UseInterceptors(FileInterceptor('excel'))
  import(@UploadedFile() file: Express.Multer.File) {
    return this.userService.import(file);
  }

  @ApiOperation({
    summary: '匹配用户',
    operationId: 'matchUser',
    description: '用学/工号匹配用户',
  })
  @ApiResponse(User)
  @Get('/match/:userNo')
  match(@Param('userNo') userNo: string) {
    return this.userService.match(userNo);
  }
}
