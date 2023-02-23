import {
  ApiForbiddenResponse,
  ApiPaginatedResponse,
  ApiResponse,
  ApiResponseArray,
  ApiUnauthorizedResponse,
  Auth,
} from '@/common/decorators';
import { Role } from '@/common/enum/role.enum';
import { ParsePositiveIntPipe } from '@/common/pipe/parse-positive-int.pipe';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { QueryAddressDto } from './dto/query-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@ApiTags('address')
@ApiForbiddenResponse()
@ApiUnauthorizedResponse()
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ summary: '创建地址', operationId: 'createAddress' })
  @ApiResponse(Address, HttpStatus.CREATED)
  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @ApiParam({ type: 'integer', name: 'addressId' })
  @ApiOperation({
    summary: '根据id查询所有祖先节点',
    operationId: 'findAncestorsById',
  })
  @ApiResponseArray(Address)
  @Auth()
  @Get('ancestors/:addressId')
  findAncestors(@Param('addressId', ParsePositiveIntPipe) id: number) {
    return this.addressService.findAncestors(id);
  }

  @ApiOperation({
    summary: '查询所有地址',
    operationId: 'getAllAddress',
  })
  @ApiPaginatedResponse(Address)
  @Auth()
  @Get()
  findAll(@Query() queryAddressDto: QueryAddressDto) {
    return this.addressService.findAll(queryAddressDto);
  }

  @ApiOperation({ summary: '根据id更新地址', operationId: 'updateAddressById' })
  @ApiParam({ type: 'integer', name: 'addressId' })
  @ApiResponse(Address)
  @Auth(Role.Admin)
  @Patch(':addressId')
  update(
    @Param('addressId', ParsePositiveIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(id, updateAddressDto);
  }

  @ApiParam({ type: 'integer', name: 'addressId' })
  @ApiResponse(Address)
  @ApiOperation({ summary: '根据id删除地址', operationId: 'deleteAddressById' })
  @Auth(Role.Admin)
  @Delete(':addressId')
  remove(@Param('addressId', ParsePositiveIntPipe) id: number) {
    return this.addressService.remove(id);
  }

  @ApiParam({ type: 'integer', name: 'addressId' })
  @ApiResponse(Address)
  @ApiOperation({
    summary: '根据id恢复地址',
    operationId: 'recoverAddressById',
  })
  @Auth(Role.Admin)
  @Patch('/recover/:addressId')
  recover(@Param('addressId', ParsePositiveIntPipe) id: number) {
    return this.addressService.recover(id);
  }
}
