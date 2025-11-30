import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ConcertStatus } from '../entities/concert.entity';

export class FilterConcertDto {
  @IsOptional()
  @IsEnum(ConcertStatus)
  status?: ConcertStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
