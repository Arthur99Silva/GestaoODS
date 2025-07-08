import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fornecedor } from './entity/fornecedor.entity';

@Injectable()
export class FornecedorService {
  constructor(
    @InjectRepository(Fornecedor)
    private readonly fornecedorRepository: Repository<Fornecedor>,
  ) {}

  async create(dto: CreateFornecedorDto): Promise<{ message: string; data: Fornecedor }> {
    try {
      const existente = await this.fornecedorRepository.findOne({
        where: { cpf_cnpj_fornecedor: dto.cpf_cnpj_fornecedor },
      });

      if (existente) {
        throw new ConflictException(
          `Fornecedor com CPF/CNPJ ${dto.cpf_cnpj_fornecedor} já existe.`,
        );
      }

      const novoFornecedor = this.fornecedorRepository.create(dto);
      const salvo = await this.fornecedorRepository.save(novoFornecedor);

      return {
        message: 'Fornecedor criado com sucesso.',
        data: salvo,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Erro ao criar fornecedor.');
    }
  }

  async findAll(): Promise<Fornecedor[]> {
    try {
      return await this.fornecedorRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao buscar fornecedores.');
    }
  }

  async findOne(cpf_cnpj: string): Promise<Fornecedor> {
    const fornecedor = await this.fornecedorRepository.findOne({
      where: { cpf_cnpj_fornecedor: cpf_cnpj },
      relations: ['produtos'],
    });

    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor ${cpf_cnpj} não encontrado.`);
    }

    return fornecedor;
  }

  async update(
    cpf_cnpj: string,
    dto: UpdateFornecedorDto,
  ): Promise<{ message: string; data: Fornecedor }> {
    try {
      const fornecedor = await this.findOne(cpf_cnpj);
      const atualizado = Object.assign(fornecedor, dto);
      const salvo = await this.fornecedorRepository.save(atualizado);

      return {
        message: 'Fornecedor atualizado com sucesso.',
        data: salvo,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Erro ao atualizar fornecedor ${cpf_cnpj}.`,
      );
    }
  }

  async remove(cpf_cnpj: string): Promise<{ message: string }> {
    try {
      const fornecedor = await this.findOne(cpf_cnpj);
      await this.fornecedorRepository.remove(fornecedor);

      return {
        message: `Fornecedor ${cpf_cnpj} removido com sucesso.`,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Erro ao remover fornecedor ${cpf_cnpj}.`,
      );
    }
  }
}
