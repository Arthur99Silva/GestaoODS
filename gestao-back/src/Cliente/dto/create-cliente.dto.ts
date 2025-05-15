
import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateClienteDto {
  @IsOptional()
  @IsString()
  @Expose({ name: 'cpf_cnpj' })
  cpf_cnpj: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'nome' })
  nome: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'email' })
  email: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'telefone' })
  telefone: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'endereco' })
  endereco: string;
}
