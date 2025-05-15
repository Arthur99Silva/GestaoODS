import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from '../entite/pedido.entity';

@Injectable()
export class PedidoRepository {
  constructor(
    @InjectRepository(Pedido)
    private readonly repository: Repository<Pedido>,
  ) {}

  findAll(): Promise<Pedido[]> {
    return this.repository.find({
      relations: ['cliente', 'forma_pagamento', 'funcionario', 'itensProduto'],
    });
  }

  findOne(id_pedido: number): Promise<Pedido | null> {
    return this.repository.findOne({
      where: { id_pedido },
      relations: ['cliente', 'forma_pagamento', 'funcionario', 'itensProduto'],
    });
  }

  create(pedido: Pedido): Promise<Pedido> {
    return this.repository.save(pedido);
  }

  async remove(id_pedido: number): Promise<void> {
    await this.repository.delete(id_pedido);
  }
}
