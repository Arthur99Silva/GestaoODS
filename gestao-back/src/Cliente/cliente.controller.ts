import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.clienteService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':cpf_cnpj')
  findOne(@Param('cpf_cnpj') cpf_cnpj: string) {
    return this.clienteService.findOne(cpf_cnpj);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':cpf_cnpj')
  update(@Param('cpf_cnpj') cpf_cnpj: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(cpf_cnpj, updateClienteDto);
  }
}
