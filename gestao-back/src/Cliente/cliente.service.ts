import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entite/cliente.entity';
import { Repository } from 'typeorm';

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

  findOne(cpf_cnpj: string) {
    return this.clienteRepository.findOne({ where: { cpf_cnpj } });
  }

  async update(cpf_cnpj: string, update: Cliente) {
    await this.clienteRepository.update(cpf_cnpj, update);
    return this.findOne(cpf_cnpj);
  }

}
