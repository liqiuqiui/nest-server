import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(REQUEST)
    private readonly req: Request & { user: User & Admin },
  ) {}

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const { page, pageSize } = paginationQueryDto;
    const [list, totalCount] = await this.userRepository.findAndCount({
      skip: pageSize * (page - 1),
      take: pageSize,
    });
    const totalPage = Math.ceil(totalCount / pageSize);
    return {
      list,
      pagination: {
        totalCount,
        totalPage,
        pageSize,
        curentPage: page,
      },
    };
  }

  async update(updateUserDto: UpdateUserDto) {
    const loginUser = this.req.user as User;

    console.log('loginUser', loginUser);

    const user = await this.userRepository.preload({
      id: loginUser.id,
      ...updateUserDto,
    });
    if (user) return this.userRepository.save(user);
    throw new NotFoundException(`user #${loginUser.id} not found`);
  }
}
