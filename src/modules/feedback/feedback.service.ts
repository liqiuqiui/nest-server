import { FeedbackState } from '@/common/constants/feedback.constant';
import { ImageType } from '@/common/constants/image.constant';
import { Image } from '@/common/entities/image.entity';
import { Role } from '@/common/enum/role.enum';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phrase } from '../phrase/entities/phrase.entity';
import { PhraseService } from '../phrase/phrase.service';
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
    private readonly phraseService: PhraseService,
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
    const user = this.req.user as User;
    const { page, pageSize, feedbackState, startTime, endTime, name, desc } =
      queryFeedbackDto;

    const builder = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.images', 'image', 'image.type=:imageType', {
        imageType: ImageType.Feedback,
      })
      .leftJoinAndSelect('feedback.user', 'user');

    // 非管理员角色查询自己的反馈，管理员查询全部反馈
    if (user.role !== Role.Admin)
      builder.andWhere('feedback.userId=:userId', { userId: user.id });

    // 按反馈状态筛选
    if (feedbackState !== undefined)
      builder.andWhere('feedback.state=:feedbackState', { feedbackState });

    // 按照反馈时间筛选
    if (startTime)
      builder.andWhere('feedback.createdTime >= :startTime', { startTime });

    if (endTime) {
      endTime.setDate(endTime.getDate() + 1);
      builder.andWhere('feedback.createdTime <= :endTime', { endTime });
    }

    // 按反馈人姓名筛选
    if (name)
      builder.andWhere('feedback.name like :name', { name: `%${name}%` });

    // 按反馈信息筛选
    if (desc)
      builder.andWhere('feedback.desc like :desc', { desc: `%${desc}%` });

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
    const { reply, phraseId } = processFeedbackDto;
    const feedback = await this.feedbackRepository.findOneBy({ id });

    if (!feedback) throw new NotFoundException(`feedback #id=${id} not found`);
    let phrase: Phrase;
    if (phraseId > 0) {
      await this.phraseService.increment(phraseId);
      phrase = await this.phraseService.findOne(phraseId);
    }

    return this.feedbackRepository.save({
      ...feedback,
      reply: reply ?? phrase.text,
      state: FeedbackState.resolve,
    });
  }
}
