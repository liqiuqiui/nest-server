import { Module } from '@nestjs/common';
import { PhraseService } from './phrase.service';
import { PhraseController } from './phrase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phrase } from './entities/phrase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Phrase])],
  controllers: [PhraseController],
  providers: [PhraseService],
  exports: [PhraseService],
})
export class PhraseModule {}
