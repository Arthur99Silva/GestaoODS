import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pedidoService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('cliente/:cpf_cnpj')
  getPedidosPorCpf(
    @Param('cpf_cnpj') cpf_cnpj: string,
    @Query('orderBy') orderBy?: 'data_venda' | 'valor_total',
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    return this.pedidoService.getPedidosPorCpfCnpj(cpf_cnpj, orderBy, order);
  }

}
