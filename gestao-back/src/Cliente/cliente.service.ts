import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entite/cliente.entity';
import { Repository } from 'typeorm';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  create(cliente: Cliente) {
    return this.clienteRepository.save(cliente);
  }

  findAll() {
    return this.clienteRepository.find();
  }

  async findOne(cpf_cnpj: string): Promise<Cliente> {
    const forma = await this.clienteRepository.findOne({
     where: { cpf_cnpj },
    });
    if (!forma) {
      throw new NotFoundException(`Cliente ${cpf_cnpj} não encontrado.`);
    }
    return forma;
  }

  async update(cpf_cnpj: string, dto: UpdateClienteDto): Promise<Cliente> {
    const forma = await this.findOne(cpf_cnpj);
    const updated = Object.assign(forma, dto);
    return this.clienteRepository.save(updated);
  }

}
