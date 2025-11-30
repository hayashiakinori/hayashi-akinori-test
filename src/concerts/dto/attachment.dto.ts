import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { AttachmentType } from '../entities/attachment.entity';

export class AttachmentDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsUrl()
  url!: string;

  @IsOptional()
  @IsEnum(AttachmentType)
  type?: AttachmentType;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
