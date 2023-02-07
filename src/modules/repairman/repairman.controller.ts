import {
  ApiForbiddenResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
  Auth,
} from '@/common/decorators';
import { Role } from '@/common/enum/role.enum';
import { Body, Controller, Patch, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateRepairmanDto } from './dto/update-repairman.dto';
import { Repairman } from './entities/repairman.entity';
import { RepairmanService } from './repairman.service';

@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@ApiTags('维修工')
@Controller('repairman')
export class RepairmanController {
  constructor(private readonly repairmanService: RepairmanService) {}

  @ApiResponse(Repairman)
  @ApiOperation({ summary: '更新账户信息' })
  @Auth(Role.Repairman)
  // @Patch('')
  @Put('')
  update(@Body() updateRepairmanDto: UpdateRepairmanDto) {
    return this.repairmanService.update(updateRepairmanDto);
  }
}
