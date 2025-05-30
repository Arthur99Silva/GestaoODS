import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Empresa {
  @PrimaryGeneratedColumn()
  id_empresa: number;

  @Column({ type: 'text', nullable: true })
  nome_empresa?: string;

  @Column({ type: 'text', nullable: true })
  cnpj_empresa?: string;

  @Column({ type: 'text', nullable: true })
  razao_social?: string;

  @Column({ type: 'text', nullable: true })
  telefone?: string;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  endereco?: string;
}
