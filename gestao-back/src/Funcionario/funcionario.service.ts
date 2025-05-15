import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(dto: CreateFuncionarioDto): Promise<Funcionario> {
    const funcionario = this.funcionarioRepository.create(dto);
    return this.funcionarioRepository.save(funcionario);
  }

  async findAll(): Promise<Funcionario[]> {
    return this.funcionarioRepository.find();
  }

  async findOne(cpf: string): Promise<Funcionario> {
    const funcionario = await this.funcionarioRepository.findOneBy({ cpf });
    if (!funcionario) {
      throw new NotFoundException(`Funcionário com CPF ${cpf} não encontrado.`);
    }
    return funcionario;
  }

  async update(cpf: string, dto: UpdateFuncionarioDto): Promise<Funcionario> {
    const funcionario = await this.findOne(cpf);
    Object.assign(funcionario, dto);
    return this.funcionarioRepository.save(funcionario);
  }

}
