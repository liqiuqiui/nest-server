import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRepairmanDto } from './dto/update-repairman.dto';
import { Repairman } from './entities/repairman.entity';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { User } from '../user/entities/user.entity';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class RepairmanService {
  constructor(
    @InjectRepository(Repairman)
    private readonly repairmanRepository: Repository<Repairman>,
    @Inject(REQUEST)
    private readonly req: Request & { user: User & Admin },
  ) {}

  async update(updateRepairmanDto: UpdateRepairmanDto) {
    const loginRepairman = this.req.user as Repairman;

    console.log('loginRepairman', loginRepairman);

    const repairman = await this.repairmanRepository.preload({
      id: loginRepairman.id,
      ...updateRepairmanDto,
    });
    if (repairman) return this.repairmanRepository.save(repairman);
    throw new NotFoundException(`repairman #${loginRepairman.id} not found`);
  }
}
