import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Fornecedor } from 'src/Fornecedor/entity/fornecedor.entity';
import { ItemProduto } from 'src/Item_Produto/entite/item-produtos.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id_produto: number;

  @Column({ type: 'text', nullable: true })
  nome_produto?: string;

  @Column({ type: 'integer', nullable: true })
  qtd_produto?: number;

  @Column({ type: 'float', nullable: true })
  valor_custo?: number;

  @Column({ type: 'float', nullable: true })
  valor_venda?: number;

  @Column({ type: 'text' })
  fk_cpf_cnpj_fornecedor: string;

  @Exclude()
  @ManyToOne(() => Fornecedor, (fornecedor) => fornecedor.produtos)
  @JoinColumn({ name: 'fk_cpf_cnpj_fornecedor' })
  fornecedor: Fornecedor;

  @OneToMany(() => ItemProduto, (itemProduto) => itemProduto.pedido)
  itensProduto: ItemProduto[];
}
