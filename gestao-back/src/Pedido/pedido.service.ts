import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entite/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Cliente } from 'src/Cliente/entite/cliente.entity';
import { Funcionario } from 'src/Funcionario/entite/funcionario.entity';
import { FormaPagamento } from 'src/Forma_Pagamento/entite/forma-pagamento.entity';
import { ItemProduto } from 'src/Item_Produto/entite/item-produtos.entity';
import { isDate } from 'class-validator';

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

  async create(dto: CreatePedidoDto): Promise<any> {
    try {
      const cliente = await this.clienteRepository.findOneBy({
        cpf_cnpj: dto.fk_cpf_cnpj_cliente,
      });
      if (!cliente) {
        throw new NotFoundException(
          `Cliente com CPF/CNPJ ${dto.fk_cpf_cnpj_cliente} não encontrado.`,
        );
      }

      const formaPagamento = await this.formaPagamentoRepository.findOneBy({
        id_forma_pagamento: dto.fk_forma_pagamento,
      });
      if (!formaPagamento) {
        throw new NotFoundException(
          `Forma de pagamento com ID ${dto.fk_forma_pagamento} não encontrada.`,
        );
      }

      const funcionario = await this.funcionarioRepository.findOneBy({
        cpf: dto.fk_cpf_funcionario,
      });
      if (!funcionario) {
        throw new NotFoundException(
          `Funcionário com CPF ${dto.fk_cpf_funcionario} não encontrado.`,
        );
      }

      const pedido = this.pedidoRepository.create({
        valor_total: dto.valor_total,
        data_venda: new Date(dto.data_venda),
        nota_fiscal: dto.nota_fiscal,
        cliente,
        forma_pagamento: formaPagamento,
        funcionario,
      });

      const pedidoSalvo = await this.pedidoRepository.save(pedido);

      // Verifica se id_pedido foi realmente retornado
      if (!pedidoSalvo.id_pedido || isNaN(pedidoSalvo.id_pedido)) {
        console.error('id_pedido ausente ou inválido:', pedidoSalvo);
        throw new InternalServerErrorException('Falha ao salvar pedido. id_pedido não gerado.');
      }

      if (dto.itens && dto.itens.length > 0) {
        for (const itemDto of dto.itens) {
          const item = this.itemProdutoRepository.create({
            pedido: pedidoSalvo,
            produto: { id_produto: itemDto.fk_produto },
            qtd_item_produto: itemDto.qtd_item_produto,
          });
          await this.itemProdutoRepository.save(item);
        }
      }

      const pedidoCompleto = await this.findOne(pedidoSalvo.id_pedido);

      return {
        message: 'Pedido criado com sucesso!',
        data: pedidoCompleto,
      };
    } catch (error) {
      // Se for um erro conhecido (NotFound, etc), relança
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      // Caso contrário, erro genérico
      console.error(error); // Útil para debug em ambiente dev
      throw new InternalServerErrorException(
        'Erro ao criar o pedido. Verifique os dados e tente novamente.',
      );
    }
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      relations: ['cliente', 'funcionario', 'forma_pagamento', 'itensProduto'],
    });
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

}
