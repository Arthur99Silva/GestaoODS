import { IsOptional, IsString } from 'class-validator';

export class UpdateAuthDto {
  @IsString()
  @IsOptional()
  senha?: string;
}
