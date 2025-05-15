import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn } from "typeorm";
//import { Produto } from "./produto.entity";
import { Pedido } from "src/Pedido/entite/pedido.entity";
import { Produto } from "src/Produto/entity/produto.entity";

@Entity()
export class ItemProduto {
  @PrimaryGeneratedColumn()
  id_lista_produto: number;

  @ManyToOne(() => Pedido, pedido => pedido.itensProduto)
  @JoinColumn({ name: 'fk_pedido_id' })
  pedido: Pedido;

  @ManyToOne(() => Produto, produto => produto.itensProduto)
  @JoinColumn({ name: 'fk_produto_id' })
  produto: Produto;
}