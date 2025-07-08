import {
  IsOptional,
  IsInt,
  IsString,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { CreateItemProdutoDto } from 'src/Item_Produto/dto/create-item-produtos.dto';

export class CreatePedidoDto {
  @IsOptional()
  @IsInt({ message: 'O campo id_pedido deve ser um número inteiro.' })
  @Expose({ name: 'id_pedido' })
  id_pedido: number;

  @IsNotEmpty({ message: 'O campo valor_total é obrigatório.' })
  @IsNumber({}, { message: 'O campo valor_total deve ser um número.' })
  @Expose({ name: 'valor_total' })
  valor_total: number;

  @IsNotEmpty({ message: 'O campo data_venda é obrigatório.' })
  @Expose({ name: 'data_venda' })
  data_venda: Date;

  @IsOptional()
  @IsString({ message: 'O campo nota_fiscal deve ser uma string.' })
  @Expose({ name: 'nota_fiscal' })
  nota_fiscal: string;

  @IsNotEmpty({ message: 'O campo fk_cpf_cnpj_cliente é obrigatório.' })
  @IsString({ message: 'O campo fk_cpf_cnpj_cliente deve ser uma string.' })
  @Expose({ name: 'fk_cpf_cnpj_cliente' })
  fk_cpf_cnpj_cliente: string;

  @IsNotEmpty({ message: 'O campo fk_forma_pagamento é obrigatório.' })
  @IsInt({ message: 'O campo fk_forma_pagamento deve ser um número inteiro.' })
  @Expose({ name: 'fk_forma_pagamento' })
  fk_forma_pagamento: number;

  @IsNotEmpty({ message: 'O campo fk_cpf_funcionario é obrigatório.' })
  @IsString({ message: 'O campo fk_cpf_funcionario deve ser uma string.' })
  @Expose({ name: 'fk_cpf_funcionario' })
  fk_cpf_funcionario: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateItemProdutoDto)
  @Expose({ name: 'itens' })
  itens: CreateItemProdutoDto[];
}
