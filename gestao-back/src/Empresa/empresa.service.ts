import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './entity/empresa.entity';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async create(dto: CreateEmpresaDto): Promise<{ message: string; data: Empresa }> {
    try {
      const existente = await this.empresaRepository.findOne({
        where: { cnpj_empresa: dto.cnpj_empresa },
      });

      if (existente) {
        throw new ConflictException(`Já existe uma empresa com o CNPJ ${dto.cnpj_empresa}.`);
      }

      const novaEmpresa = this.empresaRepository.create(dto);
      const empresaSalva = await this.empresaRepository.save(novaEmpresa);

      return {
        message: 'Empresa cadastrada com sucesso.',
        data: empresaSalva,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Erro ao cadastrar empresa.');
    }
  }

  async findAll(): Promise<Empresa[]> {
    try {
      return await this.empresaRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao buscar empresas.');
    }
  }

  async findOne(cnpj: string): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOne({
      where: { cnpj_empresa: cnpj },
    });
    if (!empresa) {
      throw new NotFoundException(`Empresa com CNPJ ${cnpj} não encontrada.`);
    }
    return empresa;
  }

  async update(cnpj: string, dto: UpdateEmpresaDto): Promise<{ message: string; data: Empresa }> {
    try {
      const empresa = await this.findOne(cnpj);
      const atualizada = Object.assign(empresa, dto);
      const salva = await this.empresaRepository.save(atualizada);

      return {
        message: 'Empresa atualizada com sucesso.',
        data: salva,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Erro ao atualizar a empresa com CNPJ ${cnpj}.`,
      );
    }
  }

  async remove(cnpj: string): Promise<{ message: string }> {
    try {
      const empresa = await this.findOne(cnpj);
      await this.empresaRepository.remove(empresa);
      return {
        message: `Empresa com CNPJ ${cnpj} removida com sucesso.`,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Erro ao remover a empresa com CNPJ ${cnpj}.`,
      );
    }
  }
}
