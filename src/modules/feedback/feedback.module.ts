import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '@/common/entities/image.entity';
import { Feedback } from './entities/feedback.entity';
import { User } from '../user/entities/user.entity';
import { PhraseModule } from '../phrase/phrase.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Feedback, User]), PhraseModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
