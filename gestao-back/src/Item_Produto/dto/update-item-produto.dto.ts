import { PartialType } from '@nestjs/mapped-types';
import { CreateItemProdutoDto } from './create-item-produtos.dto';

export class UpdateItemProdutoDto extends PartialType(CreateItemProdutoDto) {}
