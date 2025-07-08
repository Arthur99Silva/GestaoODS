import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateClienteDto {
  @IsNotEmpty({ message: 'O campo cpf_cnpj é obrigatório.' })
  @IsString({ message: 'O campo cpf_cnpj deve ser uma string.' })
  @Expose({ name: 'cpf_cnpj' })
  cpf_cnpj: string;

  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @Expose({ name: 'nome' })
  nome: string;

  @IsOptional()
  @IsString({ message: 'O campo email deve ser uma string.' })
  @Expose({ name: 'email' })
  email: string;

  @IsNotEmpty({ message: 'O campo telefone é obrigatório.' })
  @IsString({ message: 'O campo telefone deve ser uma string.' })
  @Expose({ name: 'telefone' })
  telefone: string;

  @IsOptional()
  @IsString({ message: 'O campo endereco deve ser uma string.' })
  @Expose({ name: 'endereco' })
  endereco: string;
}
