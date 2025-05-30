import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './entity/empresa.entity';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async create(dto: CreateEmpresaDto): Promise<Empresa> {
    const novaEmpresa = this.empresaRepository.create(dto);
    return this.empresaRepository.save(novaEmpresa);
  }

  async findAll(): Promise<Empresa[]> {
    return this.empresaRepository.find();
  }

  async findOne(cnpj: string): Promise<Empresa> {
    const forma = await this.empresaRepository.findOne({
      where: { cnpj_empresa: cnpj },
    });
    if (!forma) {
      throw new NotFoundException(`Empresa ${cnpj} não encontrada.`);
    }
    return forma;
  }

  async update(cnpj: string, dto: UpdateEmpresaDto): Promise<Empresa> {
    const forma = await this.findOne(cnpj);
    const updated = Object.assign(forma, dto);
    return this.empresaRepository.save(updated);
  }

  async remove(cnpj: string): Promise<void> {
    const forma = await this.findOne(cnpj);
    await this.empresaRepository.remove(forma);
  }
}
