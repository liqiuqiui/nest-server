import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: TreeRepository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    let parent: Address;
    const parentId = createAddressDto.parentId;

    if (parentId) {
      parent = await this.addressRepository.preload({
        id: parentId,
      });

      if (!parent) {
        throw new NotFoundException(`parent address #id=${parentId} not found`);
      }
    }

    const level = parent?.level ? parent.level + 1 : 1;

    const address = this.addressRepository.create({
      ...createAddressDto,
      parent,
      level,
    });

    return this.addressRepository.save(address);
  }

  findAll() {
    return this.addressRepository.findTrees();
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    let parent: Address;

    if (updateAddressDto.parentId > 0) {
      parent = await this.addressRepository.preload({
        id: updateAddressDto.parentId,
      });

      if (!parent)
        throw new NotFoundException(
          `parent address #id=${updateAddressDto.parentId} not found`,
        );
    }

    const address = await this.addressRepository.findOneBy({ id });

    if (!address)
      throw new NotFoundException(`to be updated address #id=${id} not found`);

    return this.addressRepository.save({ ...address, parent });
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
