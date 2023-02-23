import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, TreeRepository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { QueryAddressDto } from './dto/query-address.dto';
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
  async findOne(id: number) {
    const address = await this.addressRepository.findOneBy({ id });
    if (!address) throw new NotFoundException(`address #id=${id} not found`);
    return address;
  }

  async findAncestors(id: number) {
    const address = await this.addressRepository.findOneBy({ id });
    if (!address) throw new NotFoundException(`address #id=${id} not found`);
    return this.addressRepository.findAncestors(address);
  }

  async findAll(queryAddressDto: QueryAddressDto) {
    const { parentId, page, pageSize, level, name, withDeleted } =
      queryAddressDto;

    const builder = this.addressRepository
      .createQueryBuilder('address')
      .leftJoinAndSelect('address.parent', 'parent');

    if (parentId) {
      const parent = await this.addressRepository.findOneBy({ id: parentId });

      if (!parent)
        throw new NotFoundException(`parent address #id=${parentId} not found`);

      builder.andWhere('address.parentId=:parentId', { parentId });
    }

    if (name)
      builder.andWhere('address.name like :name', { name: `%${name}%` });

    if (level) builder.andWhere('address.level=:level', { level });

    if (withDeleted) builder.withDeleted();

    const [list = [], totalCount = 0] = await builder
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .printSql()
      .getManyAndCount();

    const totalPage = Math.ceil(totalCount / pageSize) ?? 0;

    return {
      list,
      pagination: {
        totalCount,
        totalPage,
        currentPage: page,
        pageSize,
      },
    };
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    let parent: Address;

    if (updateAddressDto.parentId > 0) {
      parent = await this.addressRepository.findOne({
        withDeleted: true,
        where: {
          id: updateAddressDto.parentId,
        },
      });

      if (!parent)
        throw new NotFoundException(
          `parent address #id=${updateAddressDto.parentId} not found`,
        );
    }

    const address = await this.addressRepository.findOne({
      withDeleted: true,
      where: { id },
    });

    if (!address)
      throw new NotFoundException(`to be updated address #id=${id} not found`);

    return this.addressRepository.save({
      ...address,
      name: updateAddressDto.name,
      parent,
    });
  }

  async remove(id: number) {
    const address = await this.addressRepository.findOneBy({ id });

    if (!address)
      throw new NotFoundException(`parent address #id=${id} not found`);
    const children = await this.addressRepository.findDescendants(address);
    const childrenIdList = children.map(v => v.id);
    const deleteRes = this.addressRepository.softDelete({
      id: In(childrenIdList),
    });

    return deleteRes;
  }

  async recover(id: number) {
    const address = await this.addressRepository.findOne({
      withDeleted: true,
      where: { id },
    });

    if (!address)
      throw new NotFoundException(`parent address #id=${id} not found`);
    return this.addressRepository.recover(address);
  }
}
