import { IsString, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateProdutoDto {
  @IsString()
  @Expose({ name: 'nome_produto' })
  nome_produto: string;

  @IsNumber()
  @Expose({ name: 'qtd_produto' })
  qtd_produto: number;

  @IsNumber()
  @Expose({ name: 'valor_custo' })
  valor_custo: number;

  @IsNumber()
  @Expose({ name: 'valor_venda' })
  valor_venda: number;

  @IsString()
  @Expose({ name: 'cpf_cnpj_fornecedor' })
  cpf_cnpj_fornecedor: string;
}
