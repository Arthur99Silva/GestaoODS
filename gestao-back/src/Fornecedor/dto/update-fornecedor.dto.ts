import { IsOptional, IsString } from 'class-validator';

export class UpdateFornecedorDto {
  @IsOptional()
  @IsString({ message: 'O campo nome_fornecedor deve ser uma string.' })
  nome_fornecedor: string;

  @IsOptional()
  @IsString({ message: 'O campo telefone_fornecedor deve ser uma string.' })
  telefone_fornecedor: string;

  @IsOptional()
  @IsString({ message: 'O campo email_fornecedor deve ser uma string.' })
  email_fornecedor: string;

  @IsOptional()
  @IsString({ message: 'O campo endereco_fornecedor deve ser uma string.' })
  endereco_fornecedor: string;
}
