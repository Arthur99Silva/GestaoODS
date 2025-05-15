import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Fornecedor } from 'src/Fornecedor/entity/fornecedor.entity';
import { ItemProduto } from 'src/Item_Produto/entite/item-produtos.entity';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id_produto: number;

  @Column({ type: 'text' })
  nome_produto: string;

  @Column({ type: 'integer' })
  qtd_produto: number;

  @Column({ type: 'float' })
  valor_custo: number;

  @Column({ type: 'float' })
  valor_venda: number;

  @ManyToOne(() => Fornecedor, (fornecedor) => fornecedor.produtos)
  @JoinColumn({ name: 'cpf_cnpj_fornecedor' })
  fornecedor: Fornecedor;

  @OneToMany(() => ItemProduto, itemProduto => itemProduto.pedido)
  itensProduto: ItemProduto[];
}
