import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entite/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Cliente } from 'src/Cliente/entite/cliente.entity';
import { Funcionario } from 'src/Funcionario/entite/funcionario.entity';
import { FormaPagamento } from 'src/Forma_Pagamento/entite/forma-pagamento.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: Repository<Funcionario>,

    @InjectRepository(FormaPagamento)
    private readonly formaPagamentoRepository: Repository<FormaPagamento>,
  ) { }

  async create(dto: CreatePedidoDto): Promise<Pedido> {
    const cliente = await this.clienteRepository.findOneBy({ cpf_cnpj: dto.fk_cpf_cnpj_cliente });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');

    const formaPagamento = await this.formaPagamentoRepository.findOneBy({ id_forma_pagamento: dto.fk_forma_pagamento });
    if (!formaPagamento) throw new NotFoundException('Forma de pagamento não encontrada');

    const funcionario = await this.funcionarioRepository.findOneBy({ cpf: dto.fk_cpf_funcionario });
    if (!funcionario) throw new NotFoundException('Funcionário não encontrado');

    const pedido = this.pedidoRepository.create({
      valor_total: dto.valor_total,
      data_venda: new Date(dto.data_venda), // converte string para Date
      nota_fiscal: dto.nota_fiscal,
      cliente,
      forma_pagamento: formaPagamento,
      funcionario,
    });

    return this.pedidoRepository.save(pedido);
  }



  async findAll(): Promise<Pedido[]> {
    return this.pedidoRepository.find({ relations: ['cliente', 'funcionario', 'forma_pagamento', 'itensProduto'] });
  }

  async findOne(id_pedido: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id_pedido },
      relations: ['cliente', 'funcionario', 'forma_pagamento', 'itensProduto'],
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id_pedido} não encontrado.`);
    }
    return pedido;
  }


}
