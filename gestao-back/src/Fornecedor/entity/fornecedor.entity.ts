import { Produto } from 'src/Produto/entity/produto.entity';
import { PrimaryColumn, Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Fornecedor {
  @PrimaryColumn({ type: 'text' })
  cpf_cnpj_fornecedor: string;

  @Column({ type: 'text', nullable: true })
  nome_fornecedor?: string;

  @Column({ type: 'text', nullable: true })
  telefone_fornecedor?: string;

  @Column({ type: 'text', nullable: true })
  email_fornecedor?: string;

  @Column({ type: 'text', nullable: true })
  endereco_fornecedor?: string;

  @OneToMany(() => Produto, (produto) => produto.fornecedor)
  produtos: Produto[];
}
