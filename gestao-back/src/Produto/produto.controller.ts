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
import { Produto } from './entity/produto.entity';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { instanceToPlain } from 'class-transformer';
// Caminho corrigido: removido o '/guards'
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProdutoDto: CreateProdutoDto) {
    const produto: Produto = await this.produtoService.create(createProdutoDto);
    return instanceToPlain(produto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const produtos = await this.produtoService.findAll();
    return instanceToPlain(produtos);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const produto = await this.produtoService.findOne(id);
    return instanceToPlain(produto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateProdutoDto: UpdateProdutoDto) {
    const produtoAtualizado = await this.produtoService.update(id, updateProdutoDto);
    return instanceToPlain(produtoAtualizado);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.produtoService.remove(id);
  }
}