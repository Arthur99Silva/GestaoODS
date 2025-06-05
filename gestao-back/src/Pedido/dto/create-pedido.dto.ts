import { IsOptional, IsInt, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { CreateItemProdutoDto } from 'src/Item_Produto/dto/create-item-produtos.dto';

export class CreatePedidoDto {
  @IsOptional()
  @IsInt()
  @Expose({ name: 'id_pedido' })
  id_pedido: number;

  @IsOptional()
  @IsNumber()
  @Expose({ name: 'valor_total' })
  valor_total: number;

  @IsOptional()
  @Expose({ name: 'data_venda' })
  data_venda: Date;

  @IsOptional()
  @IsString()
  @Expose({ name: 'nota_fiscal' })
  nota_fiscal: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'fk_cpf_cnpj_cliente' })
  fk_cpf_cnpj_cliente: string;

  @IsOptional()
  @IsInt()
  @Expose({ name: 'fk_forma_pagamento' })
  fk_forma_pagamento: number;

  @IsOptional()
  @IsString()
  @Expose({ name: 'fk_cpf_funcionario' })
  fk_cpf_funcionario: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateItemProdutoDto)
  @Expose({ name: 'itens' })
  itens: CreateItemProdutoDto[];
}
