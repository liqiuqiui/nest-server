import {
  ApiForbiddenResponse,
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
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@ApiTags('地址')
@ApiForbiddenResponse()
@ApiUnauthorizedResponse()
// @Auth(Role.Admin)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiResponse(Address, HttpStatus.CREATED)
  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  // @Auth()
  @ApiResponse(Address)
  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @ApiResponse(Address)
  @Patch(':addressId')
  @Put(':addressId')
  update(
    @Param('addressId', ParsePositiveIntPipe) id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':addressId')
  remove(@Param('addressId', ParsePositiveIntPipe) id: number) {
    return this.addressService.remove(id);
  }
}
