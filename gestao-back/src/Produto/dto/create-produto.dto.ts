import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateProdutoDto {
  @IsNotEmpty({ message: 'O campo nome_produto é obrigatório.' })
  @IsString({ message: 'O campo nome_produto deve ser uma string.' })
  @Expose({ name: 'nome_produto' })
  nome_produto: string;

  @IsNotEmpty({ message: 'O campo qtd_produto é obrigatório.' })
  @IsNumber({}, { message: 'O campo qtd_produto deve ser um número.' })
  @Expose({ name: 'qtd_produto' })
  qtd_produto: number;

  @IsNotEmpty({ message: 'O campo valor_custo é obrigatório.' })
  @IsNumber({}, { message: 'O campo valor_custo deve ser um número.' })
  @Expose({ name: 'valor_custo' })
  valor_custo: number;

  @IsNotEmpty({ message: 'O campo valor_venda é obrigatório.' })
  @IsNumber({}, { message: 'O campo valor_venda deve ser um número.' })
  @Expose({ name: 'valor_venda' })
  valor_venda: number;

  @IsNotEmpty({ message: 'O campo fk_cpf_cnpj_fornecedor é obrigatório.' })
  @IsString({ message: 'O campo fk_cpf_cnpj_fornecedor deve ser uma string.' })
  @Expose({ name: 'fk_cpf_cnpj_fornecedor' })
  fk_cpf_cnpj_fornecedor: string;
}
