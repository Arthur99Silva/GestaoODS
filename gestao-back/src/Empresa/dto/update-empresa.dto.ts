import { IsOptional, IsString } from 'class-validator';

export class UpdateEmpresaDto {
  @IsOptional()
  @IsString({ message: 'O campo nome_empresa deve ser uma string.' })
  nome_empresa: string;

  @IsOptional()
  @IsString({ message: 'O campo razao_social deve ser uma string.' })
  razao_social: string;

  @IsOptional()
  @IsString({ message: 'O campo telefone deve ser uma string.' })
  telefone: string;

  @IsOptional()
  @IsString({ message: 'O campo email deve ser uma string.' })
  email: string;

  @IsOptional()
  @IsString({ message: 'O campo endereco deve ser uma string.' })
  endereco: string;
}
