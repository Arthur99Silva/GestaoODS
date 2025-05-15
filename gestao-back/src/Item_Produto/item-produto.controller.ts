import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemProdutoService } from './item-produto.service';
import { CreateItemProdutoDto } from './dto/create-item-produtos.dto';
import { UpdateItemProdutoDto } from './dto/update-item-produto.dto';

@Controller('item-produto')
export class ItemProdutoController {
  constructor(private readonly itemProdutoService: ItemProdutoService) {}

  @Post()
  create(@Body() createItemProdutoDto: CreateItemProdutoDto) {
    return this.itemProdutoService.create(createItemProdutoDto);
  }

  @Get()
  findAll() {
    return this.itemProdutoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.itemProdutoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateItemProdutoDto: UpdateItemProdutoDto) {
    return this.itemProdutoService.update(id, updateItemProdutoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.itemProdutoService.remove(id);
  }
}
