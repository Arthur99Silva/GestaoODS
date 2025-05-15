import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcionario } from '../entite/funcionario.entity';

@Injectable()
export class FuncionarioRepository {
  constructor(
    @InjectRepository(Funcionario)
    private readonly repository: Repository<Funcionario>,
  ) {}

  findAll(): Promise<Funcionario[]> {
    return this.repository.find();
  }

  findOne(cpf: string): Promise<Funcionario | null> {
    return this.repository.findOne({ where: { cpf } });
  }

  create(data: Funcionario): Promise<Funcionario> {
    return this.repository.save(data);
  }

  async remove(cpf: string): Promise<void> {
    await this.repository.delete(cpf);
  }
}
