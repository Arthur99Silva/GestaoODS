import { IsOptional, IsString, IsDate, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateFuncionarioDto {
  @IsOptional()
  @IsString()
  @Expose({ name: 'cpf' })
  cpf: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'nome' })
  nome: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'telefone' })
  telefone: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'email' })
  email: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'endereco' })
  endereco: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'contrato' })
  contrato: string;

  @IsOptional()
  @Expose({ name: 'data_pagamento' })
  data_pagamento: Date;

  @IsOptional()
  @Expose({ name: 'data_ferias' })
  data_ferias: Date;

  @IsOptional()
  @IsNumber()
  @Expose({ name: 'salario' })
  salario: number;

  @IsOptional()
  @IsString()
  @Expose({ name: 'senha' })
  senha: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'role' })
  role: string;

  //@IsOptional()
  //@IsInt()
  //@Expose({ name: 'fk_empresa' })
  //fk_empresa: number;
}
