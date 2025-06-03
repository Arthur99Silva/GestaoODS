import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateAuthDto {
  @IsString()
  @Expose({ name: 'email' })
  email: string;

  @IsString()
  @Expose({ name: 'senha' })
  senha: string;
}
