import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { UpdatePhraseDto } from './dto/update-phrase.dto';
import { Phrase } from './entities/phrase.entity';

@Injectable()
export class PhraseService {
  constructor(
    @InjectRepository(Phrase)
    private readonly phraseRepository: Repository<Phrase>,
  ) {}

  async create(createPhraseDto: CreatePhraseDto) {
    if (await this.exist(createPhraseDto.text)) {
      throw new BadRequestException(`短语 '${createPhraseDto.text}' 已存在`);
    }

    const phrase = this.phraseRepository.create(createPhraseDto);
    return await this.phraseRepository.save(phrase);
  }

  findAll() {
    return this.phraseRepository.find();
  }

  findOne(id: number) {
    return this.phraseRepository.findOneBy({ id });
  }

  async update(id: number, updatePhraseDto: UpdatePhraseDto) {
    const count = await this.phraseRepository.count({
      where: { text: updatePhraseDto.text, id: Not(id) },
    });

    if (count !== 0)
      throw new BadRequestException(`短语 '${updatePhraseDto.text}' 已存在`);

    const phrase = await this.phraseRepository.preload({
      id,
      ...updatePhraseDto,
    });

    if (!phrase) throw new BadRequestException(`id='${id}'的短语不存在`);

    return this.phraseRepository.save(phrase);
  }

  async remove(id: number) {
    const phrase = await this.phraseRepository.findOneBy({ id });

    if (!phrase) throw new BadRequestException(`id='${id}'的短语不存在`);

    return this.phraseRepository.softRemove(phrase);
  }

  private async exist(text: string) {
    const count = await this.phraseRepository.countBy({ text });
    return count !== 0;
  }

  async increment(id: number) {
    const phrase = await this.phraseRepository.findOneBy({ id });

    if (!phrase) throw new BadRequestException(`id='${id}'的短语不存在`);
    return this.phraseRepository.increment(phrase, 'refCount', 1);
  }
}
