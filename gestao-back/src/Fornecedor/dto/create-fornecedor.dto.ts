import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateFornecedorDto {

  @IsString()
  @Expose({ name: 'cpf_cnpj' })
  cpf_cnpj_fornecedor: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'nome_fornecedor' })
  nome_fornecedor: string;

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
