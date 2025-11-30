import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentDto } from './attachment.dto';
import { PerformerDto } from './performer.dto';
import { ConcertStatus } from '../entities/concert-status.enum';

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/;

export class CreateConcertDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @Matches(timeRegex, { message: 'time must be in HH:mm or HH:mm:ss format' })
  time?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  repertoire?: string;

  @IsOptional()
  @IsString()
  conductor?: string;

  @IsOptional()
  @IsString()
  ensemble?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUrl()
  ticketUrl?: string;

  @IsEnum(ConcertStatus)
  status: ConcertStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PerformerDto)
  performers?: PerformerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
