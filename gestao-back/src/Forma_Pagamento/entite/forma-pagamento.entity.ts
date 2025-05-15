import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";
import { Pedido } from "src/Pedido/entite/pedido.entity";

@Entity()
export class FormaPagamento {
  @PrimaryGeneratedColumn()
  id_forma_pagamento: number;

  @Column({ type: 'text' })
  nome_forma_pagamento: string;

  @OneToMany(() => Pedido, pedido => pedido.forma_pagamento)
  pedidos?: Pedido[];

}
