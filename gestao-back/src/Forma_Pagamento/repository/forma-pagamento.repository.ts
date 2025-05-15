import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormaPagamento } from '../entite/forma-pagamento.entity';

@Injectable()
export class FormaPagamentoRepository {
  constructor(
    @InjectRepository(FormaPagamento)
    private readonly repository: Repository<FormaPagamento>,
  ) {}

  findAll(): Promise<FormaPagamento[]> {
    return this.repository.find();
  }

  create(data: FormaPagamento): Promise<FormaPagamento> {
    return this.repository.save(data);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
