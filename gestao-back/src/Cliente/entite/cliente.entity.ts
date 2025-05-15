import { PrimaryColumn, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "src/Pedido/entite/pedido.entity";

@Entity()
export class Cliente {
  @PrimaryColumn()
  cpf_cnpj: string;

  @Column({ type: 'text' })
  nome: string;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @Column({ type: 'text' })
  telefone: string;

  @Column({ type: 'text' })
  endereco: string;

  @OneToMany(() => Pedido, pedido => pedido.cliente)
  pedidos?: Pedido[];


}
