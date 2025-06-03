import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';

@Controller('funcionario')
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return this.funcionarioService.create(createFuncionarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.funcionarioService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':cpf')
  findOne(@Param('cpf') cpf: string) {
    return this.funcionarioService.findOne(cpf);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':cpf')
  update(
    @Param('cpf') cpf: string,
    @Body() updateFuncionarioDto: UpdateFuncionarioDto,
  ) {
    return this.funcionarioService.update(cpf, updateFuncionarioDto);
  }
}
