import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateEmpresaDto {
  @IsNotEmpty({ message: 'O campo nome_empresa é obrigatório.' })
  @IsString({ message: 'O campo nome_empresa deve ser uma string.' })
  @Expose({ name: 'nome_empresa' })
  nome_empresa: string;

  @IsNotEmpty({ message: 'O campo cnpj_empresa é obrigatório.' })
  @IsString({ message: 'O campo cnpj_empresa deve ser uma string.' })
  @Expose({ name: 'cnpj_empresa' })
  cnpj_empresa: string;

  @IsOptional()
  @IsString({ message: 'O campo razao_social deve ser uma string.' })
  @Expose({ name: 'razao_social' })
  razao_social: string;

  @IsNotEmpty({ message: 'O campo telefone é obrigatório.' })
  @IsString({ message: 'O campo telefone deve ser uma string.' })
  @Expose({ name: 'telefone' })
  telefone: string;

  @IsOptional()
  @IsString({ message: 'O campo email deve ser uma string.' })
  @Expose({ name: 'email' })
  email: string;

  @IsOptional()
  @IsString({ message: 'O campo endereco deve ser uma string.' })
  @Expose({ name: 'endereco' })
  endereco: string;
}
