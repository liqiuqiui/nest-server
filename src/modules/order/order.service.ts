import { ImageType } from '@/common/constants/image.constant';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
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
import { AddressService } from '../address/address.service';
import { Address } from '../address/entities/address.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly addressService: AddressService,
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
    const addressId = createOrderDto.addressId;
    const address = await this.addressService.findOne(addressId);
    if (address.level !== 3)
      throw new BadRequestException(
        `address id=[${addressId}] 不是一个三级地址`,
      );

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
      address: address as unknown as Address[],
      faultImages,
      user,
    });

    return this.orderRepository.save(order);
  }

  async findAll(queryOrderDto: QueryOrderDto) {
    const {
      page,
      pageSize,
      name,
      state,
      orderNo,
      startTime,
      endTime,
      urgentLevel,
    } = queryOrderDto;

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
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.address', 'address');

    if (user.role === Role.User) {
      builder.andWhere('order.userId = :userId', { userId: user.id });
    }

    if (user.role === Role.Repairman) {
      builder.andWhere('order.repairmanId = :repairmanId', {
        repairmanId: user.id,
      });
    }

    if (typeof urgentLevel === 'number') {
      builder.andWhere('order.urgentLevel = :urgentLevel', { urgentLevel });
    }

    if (startTime)
      builder.andWhere('order.createdTime >=:startTime', { startTime });

    if (endTime) {
      endTime.setDate(endTime.getDate() + 1);
      builder.andWhere('order.createdTime <=:endTime', { endTime });
    }

    if (orderNo)
      builder.andWhere('order.orderNo like :orderNo', {
        orderNo: `%${orderNo}%`,
      });

    if (name) builder.andWhere('order.name like :name', { name: `%${name}%` });

    if (state > -1) builder.andWhere('order.state=:state', { state });

    [list = [], totalCount = 0] = await builder
      .orderBy('order.id', 'DESC')
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .printSql()
      .getManyAndCount();

    const totalPage = Math.ceil(totalCount / pageSize) ?? 0;
    list = await Promise.all(
      list.map(async order => {
        const address = order.address as unknown as Address;

        order.address = await this.addressService.findAncestors(address.id);
        return order;
      }),
    );

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
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.address', 'address')
      .printSql()
      .getOne();
    const address = order.address as unknown as Address;

    order.address = await this.addressService.findAncestors(address.id);
    if (!order) throw new NotFoundException(`order #id=${id} not found`);
    return order;
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
