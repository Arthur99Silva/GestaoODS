import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcionario } from './entite/funcionario.entity';

@Injectable()
export class FuncionarioService {
  constructor(
    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: Repository<Funcionario>,
  ) {}

  async create(dto: CreateFuncionarioDto): Promise<{ message: string; data: Funcionario }> {
    try {
      const existente = await this.funcionarioRepository.findOneBy({ cpf: dto.cpf });
      if (existente) {
        throw new ConflictException(`Funcionário com CPF ${dto.cpf} já existe.`);
      }

      const funcionario = this.funcionarioRepository.create(dto);
      const salvo = await this.funcionarioRepository.save(funcionario);

      return {
        message: 'Funcionário criado com sucesso.',
        data: salvo,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Erro ao criar funcionário.');
    }
  }

  async findAll(): Promise<Funcionario[]> {
    try {
      return await this.funcionarioRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao buscar funcionários.');
    }
  }

  async findOne(cpf: string): Promise<Funcionario> {
    const funcionario = await this.funcionarioRepository.findOneBy({ cpf });
    if (!funcionario) {
      throw new NotFoundException(`Funcionário com CPF ${cpf} não encontrado.`);
    }
    return funcionario;
  }

  async update(cpf: string, dto: UpdateFuncionarioDto): Promise<Funcionario> {
    const result = await this.funcionarioRepository.update({ cpf }, dto);

    if (result.affected === 0) {
      throw new NotFoundException(`Funcionário com CPF ${cpf} não encontrado.`);
    }

    return this.findOne(cpf);
  }
}
