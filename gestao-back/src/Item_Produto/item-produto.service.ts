import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemProdutoDto } from './dto/create-item-produtos.dto';
import { UpdateItemProdutoDto } from './dto/update-item-produto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemProduto } from './entite/item-produtos.entity';
import { Produto } from 'src/Produto/entity/produto.entity';
import { Pedido } from 'src/Pedido/entite/pedido.entity';

@Injectable()
export class ItemProdutoService {
  constructor(
    @InjectRepository(ItemProduto)
    private readonly itemProdutoRepository: Repository<ItemProduto>,

    @InjectRepository(Produto)
    private readonly ProdutoRepository: Repository<Produto>,
  ) { }

  /*
  async create(dto: CreateItemProdutoDto): Promise<ItemProduto> {
    // Buscar Produto pelo id passado na DTO
    const produto = await this.ProdutoRepository.findOneBy({ id_produto: dto.fk_produto });
    if (!produto) {
      throw new NotFoundException(`Produto com id ${dto.fk_produto} não encontrado.`);
    }

    // Buscar Pedido pelo id passado na DTO
    const pedido = await this.PedidoRepository.findOneBy({ id_pedido: dto.fk_pedido });
    if (!pedido) {
      throw new NotFoundException(`Pedido com id ${dto.fk_pedido} não encontrado.`);
    }

    // Criar o ItemProduto associando as entidades encontradas
    const item = this.itemProdutoRepository.create({
      ...dto,
      produto,  // chave estrangeira objeto Produto
      pedido,   // chave estrangeira objeto Pedido
    });

    return this.itemProdutoRepository.save(item);
  }*/

  async findAll(): Promise<ItemProduto[]> {
    return this.itemProdutoRepository.find();
  }

  async findOne(id_lista_produto: number): Promise<ItemProduto> {
    const item = await this.itemProdutoRepository.findOneBy({ id_lista_produto });
    if (!item) {
      throw new NotFoundException(`ItemProduto com id_lista_produto ${id_lista_produto} não encontrado.`);
    }
    return item;
  }

  async update(id_lista_produto: number, dto: UpdateItemProdutoDto): Promise<ItemProduto> {
    const item = await this.findOne(id_lista_produto);
    const updated = Object.assign(item, dto);
    return this.itemProdutoRepository.save(updated);
  }

  async remove(id_lista_produto: number): Promise<void> {
    const item = await this.findOne(id_lista_produto);
    await this.itemProdutoRepository.remove(item);
  }
}
