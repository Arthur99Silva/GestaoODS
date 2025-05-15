import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Empresa {
  @PrimaryGeneratedColumn()
  id_empresa: number;

  @Column({ type: 'text' })
  nome_empresa: string;

  @Column({ type: 'text' })
  cnpj_empresa: string;

  @Column({ type: 'text' })
  razao_social: string;

  @Column({ type: 'text' })
  telefone: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  endereco: string;
}
