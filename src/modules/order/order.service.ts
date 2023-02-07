import { ImageType } from '@/common/constants/image.constant';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Image } from '../../common/entities/image.entity';
import { Order } from './entities/order.entity';
import { Request } from 'express';
import { Role } from '@/common/enum/role.enum';
import { OrderState } from '@/common/constants/order.constant';
import { ProcessOrderDto } from './dto/process-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { CommentOrderDto } from './dto/comment-order.dto';
import { AssignOrderDto } from './dto/assign-order.dto';
import { FinishOrderDto } from './dto/finish-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @Inject(REQUEST)
    private readonly req: Request & { user: User },
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const faultImages =
      createOrderDto.faultImages &&
      (await Promise.all(
        createOrderDto.faultImages.map(url =>
          this.imageRepository.create({ url, type: ImageType.Fault }),
        ),
      ));

    const user = this.req.user as User;

    const order = this.orderRepository.create({
      ...createOrderDto,
      faultImages,
      user,
    });

    return this.orderRepository.save(order);
  }

  async findAll(queryOrderDto: QueryOrderDto) {
    const { page, pageSize, name, orderState } = queryOrderDto;
    let list: Order[] = [],
      totalCount: number = 0;
    const user = this.req.user as User;
    const builder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect(
        'order.faultImages',
        'faultImages',
        'faultImages.type = :faultType',
        { faultType: ImageType.Fault },
      )
      .leftJoinAndSelect(
        'order.finishImages',
        'finishImages',
        'finishImages.type = :finishType',
        { finishType: ImageType.Finish },
      )
      .leftJoinAndSelect('order.repairman', 'repairman')
      .leftJoinAndSelect('order.user', 'user');

    if (user.role === Role.User) {
      builder.andWhere('order.userId = :userId', { userId: user.id });
    }

    if (user.role === Role.Repairman) {
      builder.andWhere('order.repairmanId = :repairmanId', {
        repairmanId: user.id,
      });
    }

    if (name) builder.andWhere('user.name like :name', { name: `%${name}%` });

    if (typeof orderState === 'number')
      builder.andWhere('order.state=:orderState', { orderState });

    [list = [], totalCount = 0] = await builder
      .orderBy('order.id', 'DESC')
      .skip(pageSize * (page - 1))
      .take(pageSize)
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

  async findOne(id: number) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .leftJoinAndSelect(
        'order.faultImages',
        'faultImages',
        'faultImages.type = :faultType',
        { faultType: ImageType.Fault },
      )
      .leftJoinAndSelect(
        'order.finishImages',
        'finishImages',
        'finishImages.type = :finishType',
        {
          finishType: ImageType.Finish,
        },
      )
      .leftJoinAndSelect('order.repairman', 'repairman')
      .printSql()
      .getOne();

    if (!order) throw new NotFoundException(`order #id=${id} not found`);
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const faultImages =
      updateOrderDto.faultImages &&
      (await Promise.all(
        updateOrderDto.faultImages.map(url =>
          this.preloadImageByUrl(url, ImageType.Fault),
        ),
      ));
    const order = await this.orderRepository.preload({
      id,
      ...updateOrderDto,
      faultImages,
    });
    if (!order) throw new NotFoundException(`order #id=${id} not found`);
    return this.orderRepository.save(order);
  }

  async process(id: number, processOrderDto: ProcessOrderDto) {
    const order = await this.orderRepository.findOneBy({
      id,
      state: OrderState.init,
    });
    if (!order)
      throw new NotFoundException(`to be processed order #id=${id} found`);
    return this.orderRepository.save({ ...order, ...processOrderDto });
  }

  async comment(id: number, commentOrderDto: CommentOrderDto) {
    const order = await this.orderRepository.findOne({
      where: {
        id,
        state: OrderState.finish,
        comment: IsNull(),
        reason: IsNull(),
        star: IsNull(),
        user: {
          id: this.req.user.id,
        },
      },
    });

    if (!order)
      throw new NotFoundException(`to be commented order #id=${id} not found`);

    return this.orderRepository.save({ ...order, ...commentOrderDto });
  }

  async assign(id: number, assignOrderDto: AssignOrderDto) {
    const { repairmanId } = assignOrderDto;
    const repairman = await this.userRepository.findOneBy({
      id: repairmanId,
    });

    if (!repairman)
      throw new NotFoundException(`repairman id=${repairmanId} not found`);

    const order = await this.orderRepository.findOneBy({
      id,
      state: OrderState.pass,
    });

    if (!order)
      throw new NotFoundException(`to be assigned order #id=${id} not found`);

    return this.orderRepository.save({
      ...order,
      repairman,
      state: OrderState.assigned,
    });
  }

  async finish(id: number, finishOrderDto: FinishOrderDto) {
    const order = await this.orderRepository.findOne({
      where: {
        repairman: {
          id: this.req.user.id,
        },
        state: OrderState.assigned,
      },
    });

    if (!order) throw new NotFoundException(`to be finish #id=${id} not found`);

    const finishImages = await Promise.all(
      finishOrderDto.finishImages.map(url =>
        this.preloadImageByUrl(url, ImageType.Finish),
      ),
    );

    return this.orderRepository.save({
      ...order,
      ...finishOrderDto,
      state: OrderState.finish,
      finishImages,
      fixTime: new Date(),
    });
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id,
        user: {
          id: this.req.user.id,
        },
      },
    });

    if (!order) throw new NotFoundException(`order #id=${id}  not found`);

    return this.orderRepository.softRemove(order);
  }

  private async preloadImageByUrl(url: string, type: ImageType) {
    const existImg = await this.imageRepository.findOneBy({ url, type });
    if (existImg) return existImg;
    return this.imageRepository.create({ url, type });
  }
}
