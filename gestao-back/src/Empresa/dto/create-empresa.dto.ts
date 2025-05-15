import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateEmpresaDto {
  @IsOptional()
  @IsString()
  @Expose({ name: 'nome_empresa' })
  nome_empresa: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'cnpj_empresa' })
  cnpj_empresa: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'razao_social' })
  razao_social: string;

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
}
