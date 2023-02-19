import { IsString, Length } from 'class-validator';

export class CreatePhraseDto {
  @IsString()
  @Length(1, 200)
  text: string;
}
