import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class PerformerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
