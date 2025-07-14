import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
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
    const resultado = await this.produtoService.create(createProdutoDto);
    // resultado.message é a mensagem de sucesso
    // resultado.data é o Produto criado
    return instanceToPlain(resultado);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const produtos = await this.produtoService.findAll();
    return instanceToPlain(produtos);
  }

  @UseGuards(JwtAuthGuard)
  @Get('menor-quantidade')
  async get100MenorQuantidade() {
    const produtos = await this.produtoService.encontrar100MenorQuantidade();
    return instanceToPlain(produtos);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      throw new BadRequestException(`ID inválido: ${id}`);
    }
    const produto = await this.produtoService.findOne(parsedId);
    return instanceToPlain(produto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ) {
    const produtoAtualizado = await this.produtoService.update(
      id,
      updateProdutoDto,
    );
    return instanceToPlain(produtoAtualizado);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.produtoService.remove(id);
  }
}