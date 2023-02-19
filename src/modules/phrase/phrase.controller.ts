import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PhraseService } from './phrase.service';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { UpdatePhraseDto } from './dto/update-phrase.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiResponseArray,
  ApiUnauthorizedResponse,
  Auth,
} from '@/common/decorators';
import { Role } from '@/common/enum/role.enum';
import { Phrase } from './entities/phrase.entity';
import { ParsePositiveIntPipe } from '@/common/pipe/parse-positive-int.pipe';

@ApiForbiddenResponse()
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@Auth(Role.Admin)
@ApiTags('phrase')
@Controller('phrase')
export class PhraseController {
  constructor(private readonly phraseService: PhraseService) {}

  @ApiOperation({
    summary: '创建一条快捷短语',
    operationId: 'createPhrase',
  })
  @ApiBadRequestResponse()
  @ApiResponse(Phrase, HttpStatus.CREATED)
  @Post()
  create(@Body() createPhraseDto: CreatePhraseDto) {
    return this.phraseService.create(createPhraseDto);
  }

  @ApiOperation({
    summary: '查询所有快捷短语',
    operationId: 'getAllPhrase',
  })
  @ApiResponseArray(Phrase)
  @Get()
  findAll() {
    return this.phraseService.findAll();
  }

  @ApiOperation({
    summary: '根据id更新快捷短语',
    operationId: 'updatePhraseById',
  })
  @ApiNotFoundResponse()
  @ApiResponse(Phrase)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updatePhraseDto: UpdatePhraseDto,
  ) {
    return this.phraseService.update(id, updatePhraseDto);
  }

  @ApiOperation({ summary: '删除快捷短语', operationId: 'deletePhraseById' })
  @ApiNotFoundResponse()
  @ApiResponse(Phrase)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.phraseService.remove(id);
  }
}
