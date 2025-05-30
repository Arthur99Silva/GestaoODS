import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateFornecedorDto {
  @IsString()
  @Expose({ name: 'cpf_cnpj_fornecedor' })
  cpf_cnpj_fornecedor: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'nome_fornecedor' })
  nome_fornecedor: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'telefone_fornecedor' })
  telefone_fornecedor: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'email_fornecedor' })
  email_fornecedor: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'endereco_fornecedor' })
  endereco_fornecedor: string;
}
