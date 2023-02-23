import {
  ApiForbiddenResponse,
  ApiPaginatedResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@/common/decorators';
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
// @Auth(Role.Admin)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ summary: '创建地址', operationId: 'createAddress' })
  @ApiResponse(Address, HttpStatus.CREATED)
  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @ApiOperation({
    summary: '根据父级id查询所有节点',
    operationId: 'getAllAddress',
  })
  @ApiPaginatedResponse(Address)
  @Get()
  findAll(@Query() queryAddressDto: QueryAddressDto) {
    return this.addressService.findAll(queryAddressDto);
  }

  @ApiOperation({ summary: '根据id更新地址', operationId: 'updateAddressById' })
  @ApiParam({ type: 'integer', name: 'addressId' })
  @ApiResponse(Address)
  @Patch(':addressId')
  // @Put(':addressId')
  update(
    @Param('addressId', ParsePositiveIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(id, updateAddressDto);
  }

  @ApiResponse(Address)
  @ApiOperation({ summary: '根据id删除地址', operationId: 'deleteAddressById' })
  @Delete(':addressId')
  remove(@Param('addressId', ParsePositiveIntPipe) id: number) {
    return this.addressService.remove(id);
  }

  @ApiResponse(Address)
  @ApiOperation({
    summary: '根据id恢复地址',
    operationId: 'recoverAddressById',
  })
  @Patch('/recover/:addressId')
  recover(@Param('addressId', ParsePositiveIntPipe) id: number) {
    return this.addressService.recover(id);
  }
}
