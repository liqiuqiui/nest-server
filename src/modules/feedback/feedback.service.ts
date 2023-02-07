import { FeedbackState } from '@/common/constants/feedback.constant';
import { ImageType } from '@/common/constants/image.constant';
import { Image } from '@/common/entities/image.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ProcessFeedbackDto } from './dto/procecc-feedback.dto';
import { QueryFeedbackDto } from './dto/query-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @Inject(REQUEST)
    private readonly req: Request & { user: User },
  ) {}
  async create(createFeedbackDto: CreateFeedbackDto) {
    const images =
      createFeedbackDto.images.length &&
      (await Promise.all(
        createFeedbackDto.images.map(url =>
          this.imageRepository.create({ url, type: ImageType.Feedback }),
        ),
      ));
    const user = this.req.user as User;

    const feedback = this.feedbackRepository.create({
      ...createFeedbackDto,
      images,
      user,
    });
    return this.feedbackRepository.save(feedback);
  }

  async findAll(queryFeedbackDto: QueryFeedbackDto) {
    const { page, pageSize, feedbackState } = queryFeedbackDto;
    const builder = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.images', 'image', 'image.type=:imageType', {
        imageType: ImageType.Feedback,
      })
      .leftJoinAndSelect('feedback.user', 'user')
      .where('feedback.userId=:userId', { userId: this.req.user.id });

    if (feedbackState !== undefined) {
      builder.andWhere('feedback.state=:feedbackState', { feedbackState });
    }
    const [list = [], totalCount = 0] = await builder
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .orderBy('feedback.id', 'ASC')
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
    const feedback = await this.feedbackRepository.findOneBy({ id });
    if (!feedback) throw new NotFoundException(`feedback #id=${id} not found`);
    return feedback;
  }

  async process(id: number, processFeedbackDto: ProcessFeedbackDto) {
    console.log('------------------------', id);

    const feedback = await this.feedbackRepository.findOneBy({ id });
    console.log(feedback);

    if (!feedback) throw new NotFoundException(`feedback #id=${id} not found`);
    return this.feedbackRepository.save({
      ...feedback,
      ...processFeedbackDto,
      state: FeedbackState.resolve,
    });
  }
}
