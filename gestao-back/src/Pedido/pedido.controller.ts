import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pedidoService.findOne(id);
  }

  @Get('mes/:numero')
  findMonthStats(@Param('numero') numero: number) {
    return this.pedidoService.monthStats(numero);
  }
}
