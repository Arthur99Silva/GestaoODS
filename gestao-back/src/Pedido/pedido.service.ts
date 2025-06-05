import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entite/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Cliente } from 'src/Cliente/entite/cliente.entity';
import { Funcionario } from 'src/Funcionario/entite/funcionario.entity';
import { FormaPagamento } from 'src/Forma_Pagamento/entite/forma-pagamento.entity';
import { ItemProduto } from 'src/Item_Produto/entite/item-produtos.entity';

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

    @InjectRepository(ItemProduto)
    private readonly itemProdutoRepository: Repository<ItemProduto>,

  ) { }

  async create(dto: CreatePedidoDto): Promise<Pedido> {
    const cliente = await this.clienteRepository.findOneBy({ cpf_cnpj: dto.fk_cpf_cnpj_cliente });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');

    const formaPagamento = await this.formaPagamentoRepository.findOneBy({ id_forma_pagamento: dto.fk_forma_pagamento });
    if (!formaPagamento) throw new NotFoundException('Forma de pagamento não encontrada');

    const funcionario = await this.funcionarioRepository.findOneBy({ cpf: dto.fk_cpf_funcionario });
    if (!funcionario) throw new NotFoundException('Funcionário não encontrado');

    // Cria o pedido
    const pedido = this.pedidoRepository.create({
      valor_total: dto.valor_total,
      data_venda: new Date(dto.data_venda),
      nota_fiscal: dto.nota_fiscal,
      cliente,
      forma_pagamento: formaPagamento,
      funcionario,
    });

    // Salva o pedido primeiro para obter o id
    const pedidoSalvo = await this.pedidoRepository.save(pedido);

    // Se houver itens, salva também
    if (dto.itens && dto.itens.length > 0) {
      for (const itemDto of dto.itens) {
        const item = this.itemProdutoRepository.create({
          pedido: pedidoSalvo,
          produto: { id_produto: itemDto.fk_produto }, // você pode buscar o produto completo se precisar validar
          qtd_item_produto: itemDto.qtd_item_produto,
        });
        await this.itemProdutoRepository.save(item);
      }
    }

    return this.findOne(pedidoSalvo.id_pedido); // Retorna com todos os relacionamentos
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

  async getPedidosPorCpfCnpj(
    cpf_cnpj: string,
    orderBy: 'data_venda' | 'valor_total' = 'data_venda',
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.pedidoRepository.find({
      where: {
        cliente: {
          cpf_cnpj,
        },
      },
      relations: ['cliente', 'funcionario', 'forma_pagamento', 'itensProduto'],
      order: {
        [orderBy]: order,
      },
    });
  }

  async getPedidosPorData(
    data: string,
    orderBy?: 'data_venda' | 'valor_total',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Pedido[]> {
    const query = this.pedidoRepository.createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.cliente', 'cliente')
      .leftJoinAndSelect('pedido.funcionario', 'funcionario')
      .leftJoinAndSelect('pedido.forma_pagamento', 'forma_pagamento')
      .leftJoinAndSelect('pedido.itensProduto', 'itensProduto')
      .where('DATE(pedido.data_venda) = :data', { data });

    if (orderBy) {
      query.orderBy(`pedido.${orderBy}`, order);
    }

    return query.getMany();
  }



}
