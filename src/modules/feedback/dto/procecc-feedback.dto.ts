import { IsString } from 'class-validator';

export class ProcessFeedbackDto {
  @IsString()
  reply: string;
}
