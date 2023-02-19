import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Notice } from './entities/notice.entity';
import { Request } from 'express';
// import { Admin } from '../admin/entities/admin.entity';
import { User } from '../user/entities/user.entity';
import { QueryNoticeDto } from './dto/qeury-notice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
    @Inject(REQUEST)
    private readonly req: Request & { user: User },
  ) {}

  create(createNoticeDto: CreateNoticeDto) {
    const notice = this.noticeRepository.create(createNoticeDto);
    return this.noticeRepository.save(notice);
  }

  async findAll(queryNoticeDto: QueryNoticeDto) {
    const { page, pageSize, withDeleted } = queryNoticeDto;
    const [list, totalCount] = await this.noticeRepository.findAndCount({
      withDeleted: !!withDeleted,
      skip: pageSize * (page - 1),
      take: pageSize,
      order: {
        id: 'desc',
      },
    });
    const totalPage = Math.ceil(totalCount / pageSize);
    return {
      list,
      pagination: {
        totalCount,
        totalPage,
        pageSize,
        currentPage: page,
      },
    };
  }

  async findOne(id: number) {
    const notice = await this.noticeRepository.findOneBy({ id });
    if (!notice) throw new NotFoundException(`notice #id=${id} not found`);

    return notice;
  }

  async update(id: number, updateNoticeDto: UpdateNoticeDto) {
    const notice = await this.noticeRepository.preload({
      id,
      ...updateNoticeDto,
    });
    if (!notice) throw new NotFoundException(`notice #id=${id} not found`);

    return this.noticeRepository.save(notice);
  }

  async remove(id: number) {
    const notice = await this.noticeRepository.findOneBy({ id });
    if (!notice) throw new NotFoundException(`notice #id=${id} not found`);

    return this.noticeRepository.softRemove(notice);
  }
  async recover(id: number) {
    const notice = await this.noticeRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!notice) throw new NotFoundException(`notice #id=${id} not found`);

    return this.noticeRepository.recover(notice);
  }
}
