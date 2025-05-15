import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entite/cliente.entity';

@Injectable()
export class ClienteRepository {
  constructor(
    @InjectRepository(Cliente)
    private readonly repository: Repository<Cliente>,
  ) {}

  findAll(): Promise<Cliente[]> {
    return this.repository.find();
  }

  findOne(cpf_cnpj: string): Promise<Cliente | null> {
    return this.repository.findOne({ where: { cpf_cnpj } });
  }

  create(data: Cliente): Promise<Cliente> {
    return this.repository.save(data);
  }

  async remove(cpf_cnpj: string): Promise<void> {
    await this.repository.delete(cpf_cnpj);
  }
}
