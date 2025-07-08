import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entite/cliente.entity';
import { Repository } from 'typeorm';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async create(cliente: Cliente) {
    const existing = await this.clienteRepository.findOne({
      where: { cpf_cnpj: cliente.cpf_cnpj },
    });

    if (existing) {
      throw new ConflictException(
        `Já existe um cliente cadastrado com o CPF/CNPJ ${cliente.cpf_cnpj}.`,
      );
    }

    try {
      return await this.clienteRepository.save(cliente);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o cliente. Verifique os dados e tente novamente.',
      );
    }
  }

  async findAll() {
    try {
      return await this.clienteRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar clientes. Tente novamente mais tarde.',
      );
    }
  }

  async findOne(cpf_cnpj: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { cpf_cnpj },
    });

    if (!cliente) {
      throw new NotFoundException(
        `Cliente com CPF/CNPJ ${cpf_cnpj} não encontrado.`,
      );
    }

    return cliente;
  }

  async update(cpf_cnpj: string, dto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(cpf_cnpj);

    const updated = Object.assign(cliente, dto);

    try {
      return await this.clienteRepository.save(updated);
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao atualizar o cliente ${cpf_cnpj}.`,
      );
    }
  }
}
