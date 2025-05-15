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

  async findOne(id: number): Promise<Empresa> {
    const forma = await this.empresaRepository.findOneBy({ id_empresa: id });
    if (!forma) {
      throw new NotFoundException(`Empresa ${id} não encontrada.`);
    }
    return forma;
  }

  async update(id: number, dto: UpdateEmpresaDto): Promise<Empresa> {
    const forma = await this.findOne(id);
    const updated = Object.assign(forma, dto);
    return this.empresaRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const forma = await this.findOne(id);
    await this.empresaRepository.remove(forma);
  }
}
