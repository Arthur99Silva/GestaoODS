import { IsOptional, IsInt, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateFormaPagamentoDto {

  @IsOptional()
  @IsString()
  @Expose({ name: 'nome_forma_pagamento' })
  nome_forma_pagamento: string;
}
