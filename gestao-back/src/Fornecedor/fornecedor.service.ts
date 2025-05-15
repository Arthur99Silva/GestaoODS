import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fornecedor } from './entity/fornecedor.entity';

@Injectable()
export class FornecedorService {
  constructor(
    @InjectRepository(Fornecedor)
    private readonly fornecedorRepository: Repository<Fornecedor>,
  ) {}

  async create(dto: CreateFornecedorDto): Promise<Fornecedor> {
    const novaFornecedor = this.fornecedorRepository.create(dto);
    return this.fornecedorRepository.save(novaFornecedor);
  }

  async findAll(): Promise<Fornecedor[]> {
    return this.fornecedorRepository.find();
  }

  async findOne(cpf_cnpj: string): Promise<Fornecedor> {
    const forma = await this.fornecedorRepository.findOne({
      where: { cpf_cnpj_fornecedor: cpf_cnpj },
      relations: ['produtos'],
    });
    if (!forma) {
      throw new NotFoundException(`Fornecedor ${cpf_cnpj} não encontrado.`);
    }
    return forma;
  }

  async update(
    cpf_cnpj: string,
    dto: UpdateFornecedorDto,
  ): Promise<Fornecedor> {
    const forma = await this.findOne(cpf_cnpj);
    const updated = Object.assign(forma, dto);
    return this.fornecedorRepository.save(updated);
  }

  async remove(cpf_cnpj: string): Promise<void> {
    const forma = await this.findOne(cpf_cnpj);
    await this.fornecedorRepository.remove(forma);
  }
}
