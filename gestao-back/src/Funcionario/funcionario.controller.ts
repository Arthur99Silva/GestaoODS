import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';

@Controller('funcionario')
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @Post()
  create(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return this.funcionarioService.create(createFuncionarioDto);
  }

  @Get()
  findAll() {
    return this.funcionarioService.findAll();
  }

  @Get(':cpf')
  findOne(@Param('cpf') cpf: string) {   
    return this.funcionarioService.findOne(cpf);
  }

  @Patch(':cpf')
  update(@Param('cpf') cpf: string, @Body() updateFuncionarioDto: UpdateFuncionarioDto) {  
    return this.funcionarioService.update(cpf, updateFuncionarioDto);
  }
  
}
