import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateFornecedorDto {
  @IsNotEmpty({ message: 'O campo cpf_cnpj_fornecedor é obrigatório.' })
  @IsString({ message: 'O campo cpf_cnpj_fornecedor deve ser uma string.' })
  @Expose({ name: 'cpf_cnpj_fornecedor' })
  cpf_cnpj_fornecedor: string;

  @IsNotEmpty({ message: 'O campo nome_fornecedor é obrigatório.' })
  @IsString({ message: 'O campo nome_fornecedor deve ser uma string.' })
  @Expose({ name: 'nome_fornecedor' })
  nome_fornecedor: string;

  @IsNotEmpty({ message: 'O campo telefone_fornecedor é obrigatório.' })
  @IsString({ message: 'O campo telefone_fornecedor deve ser uma string.' })
  @Expose({ name: 'telefone_fornecedor' })
  telefone_fornecedor: string;

  @IsOptional()
  @IsString({ message: 'O campo email_fornecedor deve ser uma string.' })
  @Expose({ name: 'email_fornecedor' })
  email_fornecedor: string;

  @IsOptional()
  @IsString({ message: 'O campo endereco_fornecedor deve ser uma string.' })
  @Expose({ name: 'endereco_fornecedor' })
  endereco_fornecedor: string;
}
