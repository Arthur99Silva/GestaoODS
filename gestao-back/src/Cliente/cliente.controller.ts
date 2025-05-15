import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  findAll() {
    return this.clienteService.findAll();
  }

  @Get(':cpf_cnpj')
  findOne(@Param('cpf_cnpj') cpf_cnpj: string) {
    return this.clienteService.findOne(cpf_cnpj);
  }

}
