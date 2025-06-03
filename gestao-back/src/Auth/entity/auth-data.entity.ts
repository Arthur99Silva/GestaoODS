import { PrimaryColumn, Entity, Column } from 'typeorm';

@Entity()
export class AuthData {
  @PrimaryColumn()
  email: string;

  @Column()
  senha: string;
}
