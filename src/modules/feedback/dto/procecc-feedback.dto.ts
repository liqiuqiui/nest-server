import { IsOptional, IsPositive, IsString } from 'class-validator';

export class ProcessFeedbackDto {
  @IsString()
  @IsOptional()
  reply?: string;

  @IsPositive()
  @IsOptional()
  phraseId?: number;
}
