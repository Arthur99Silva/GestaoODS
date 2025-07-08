import { IsOptional, IsNotEmpty, IsString, IsDate, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateFuncionarioDto {
  @IsNotEmpty({ message: 'O campo cpf é obrigatório.' })
  @IsString({ message: 'O campo cpf deve ser uma string.' })
  @Expose({ name: 'cpf' })
  cpf: string;

  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @Expose({ name: 'nome' })
  nome: string;

  @IsNotEmpty({ message: 'O campo telefone é obrigatório.' })
  @IsString({ message: 'O campo telefone deve ser uma string.' })
  @Expose({ name: 'telefone' })
  telefone: string;

  @IsOptional()
  @IsString({ message: 'O campo email deve ser uma string.' })
  @Expose({ name: 'email' })
  email: string;

  @IsNotEmpty({ message: 'O campo endereco é obrigatório.' })
  @IsString({ message: 'O campo endereco deve ser uma string.' })
  @Expose({ name: 'endereco' })
  endereco: string;

  @IsNotEmpty({ message: 'O campo contrato é obrigatório.' })
  @IsString({ message: 'O campo contrato deve ser uma string.' })
  @Expose({ name: 'contrato' })
  contrato: string;

  @IsNotEmpty({ message: 'O campo data_pagamento é obrigatório.' })
  @Expose({ name: 'data_pagamento' })
  data_pagamento: Date;

  @IsNotEmpty({ message: 'O campo data_ferias é obrigatório.' })
  @Expose({ name: 'data_ferias' })
  data_ferias: Date;

  @IsNotEmpty({ message: 'O campo salario é obrigatório.' })
  @IsNumber({}, { message: 'O campo salario deve ser um número.' })
  @Expose({ name: 'salario' })
  salario: number;

  @IsNotEmpty({ message: 'O campo senha é obrigatório.' })
  @IsString({ message: 'O campo senha deve ser uma string.' })
  @Expose({ name: 'senha' })
  senha: string;

  @IsNotEmpty({ message: 'O campo role é obrigatório.' })
  @IsString({ message: 'O campo role deve ser uma string.' })
  @Expose({ name: 'role' })
  role: string;
}
