import { Produto } from 'src/Produto/entity/produto.entity';
import { PrimaryColumn, Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Fornecedor {
  @PrimaryColumn({ type: 'text' })
  cpf_cnpj_fornecedor: string;

  @Column({ type: 'text' })
  nome_fornecedor: string;

  @Column({ type: 'text' })
  telefone: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  endereco: string;

  @OneToMany(() => Produto, (produto) => produto.fornecedor)
  produtos: Produto[];
}
