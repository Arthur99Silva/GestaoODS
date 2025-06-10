import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ItemProdutoService } from './item-produto.service';
import { CreateItemProdutoDto } from './dto/create-item-produtos.dto';
import { UpdateItemProdutoDto } from './dto/update-item-produto.dto';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';

@Controller('item-produto')
export class ItemProdutoController {
  constructor(private readonly itemProdutoService: ItemProdutoService) {}

  /*
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createItemProdutoDto: CreateItemProdutoDto) {
    return this.itemProdutoService.create(createItemProdutoDto);
  }
  */

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.itemProdutoService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.itemProdutoService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateItemProdutoDto: UpdateItemProdutoDto,
  ) {
    return this.itemProdutoService.update(id, updateItemProdutoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.itemProdutoService.remove(id);
  }
}
