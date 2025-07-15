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
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';

@Controller()
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('empresa')
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresaService.create(createEmpresaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('empresa')
  findAll() {
    return this.empresaService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('empresa/*id')
  findOne(@Param('id') id: string | string[]) {
    const cleanId = Array.isArray(id) ? id.join('/') : id;
    return this.empresaService.findOne(cleanId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('empresa/*id')
  update(
    @Param('id') id: string | string[],
    @Body() updateEmpresaDto: UpdateEmpresaDto,
  ) {
    const cleanId = Array.isArray(id) ? id.join('/') : id;
    return this.empresaService.update(cleanId, updateEmpresaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('empresa/*id')
  remove(@Param('id') id: string | string[]) {
    const cleanId = Array.isArray(id) ? id.join('/') : id;
    return this.empresaService.remove(cleanId);
  }
}
