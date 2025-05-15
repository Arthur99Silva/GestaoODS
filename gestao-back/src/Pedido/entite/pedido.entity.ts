import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { FormaPagamento } from "src/Forma_Pagamento/entite/forma-pagamento.entity";
import { Funcionario } from "src/Funcionario/entite/funcionario.entity";
import { Cliente } from "src/Cliente/entite/cliente.entity";
import { ItemProduto } from "src/Item_Produto/entite/item-produtos.entity";

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id_pedido: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  valor_total: number;

  @Column({ type: 'timestamp' })
  data_venda: Date;

  @Column({ type: 'text' })
  nota_fiscal: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'fk_cpf_cnpj_cliente' })
  cliente: Cliente;

  @ManyToOne(() => FormaPagamento)
  @JoinColumn({ name: 'fk_forma_pagamento' })
  forma_pagamento: FormaPagamento;

  @ManyToOne(() => Funcionario)
  @JoinColumn({ name: 'fk_cpf_funcionario' })
  funcionario: Funcionario;
  
  @OneToMany(() => ItemProduto, itemProduto => itemProduto.pedido)
  itensProduto: ItemProduto[];

}
