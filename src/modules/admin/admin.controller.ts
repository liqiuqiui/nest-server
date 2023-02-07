import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@/common/decorators';
import { Controller, Body, Patch, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { AdminService } from './admin.service';
import { SwitchRoleDto } from './dto/switch-role.dto';

@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiTags('管理员')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiBadRequestResponse()
  @ApiResponse(User)
  @ApiOperation({ summary: '角色转换' })
  @Patch('/switchRole')
  @Put('/switchRole')
  switchRole(@Body() switchRoleDto: SwitchRoleDto) {
    return this.adminService.switchRole(switchRoleDto);
  }
}
