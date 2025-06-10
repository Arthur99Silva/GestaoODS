import { IsOptional, IsInt } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateItemProdutoDto {
  @IsOptional()
  @IsInt()
  @Expose({ name: 'fk_produto' })
  fk_produto: number;

  @IsOptional()
  @IsInt()
  @Expose({ name: 'qtd_item_produto' })
  qtd_item_produto: number;
  
}
