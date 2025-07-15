import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateFuncionarioDto {
  @IsOptional()
  @IsString({ message: 'O campo nome deve ser uma string.' })
  nome: string;

  @IsOptional()
  @IsString({ message: 'O campo telefone deve ser uma string.' })
  telefone: string;

  @IsOptional()
  @IsString({ message: 'O campo email deve ser uma string.' })
  email: string;

  @IsOptional()
  @IsString({ message: 'O campo endereco deve ser uma string.' })
  endereco: string;

  @IsOptional()
  @IsString({ message: 'O campo contrato deve ser uma string.' })
  contrato: string;

  @IsOptional()
  data_pagamento: Date;

  @IsOptional()
  data_ferias: Date;

  @IsOptional()
  @IsNumber({}, { message: 'O campo salario deve ser um número.' })
  salario: number;

  @IsOptional()
  @IsString({ message: 'O campo senha deve ser uma string.' })
  senha: string;

  @IsOptional()
  @IsString({ message: 'O campo role deve ser uma string.' })
  role: string;
}
