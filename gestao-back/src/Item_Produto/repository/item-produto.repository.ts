import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemProduto } from '../entite/item-produtos.entity';

@Injectable()
export class ItemProdutoRepository {
  constructor(
    @InjectRepository(ItemProduto)
    private readonly repository: Repository<ItemProduto>,
  ) { }

  findAll(): Promise<ItemProduto[]> {
    return this.repository.find();
  }

  findOne(id_lista_produto: number): Promise<ItemProduto | null> {
    return this.repository.findOne({ where: { id_lista_produto } });
  }

  create(data: ItemProduto): Promise<ItemProduto> {
    return this.repository.save(data);
  }

  async remove(id_lista_produto: number): Promise<void> {
    await this.repository.delete(id_lista_produto);
  }

}
