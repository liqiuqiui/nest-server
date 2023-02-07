import { Controller, Get, Body, Patch, Query, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { Role } from '@/common/enum/role.enum';
import { User } from './entities/user.entity';
import {
  ApiForbiddenResponse,
  ApiPaginatedResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
  Auth,
} from '@/common/decorators';

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

  @ApiResponse(User)
  @ApiOperation({ summary: '更新账户信息' })
  @Auth(Role.User)
  // @Patch('')
  @Put('')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }
}
