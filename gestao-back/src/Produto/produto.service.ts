import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entity/produto.entity';
import { Fornecedor } from 'src/Fornecedor/entity/fornecedor.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    @InjectRepository(Fornecedor)
    private readonly fornecedorRepository: Repository<Fornecedor>,
  ) {}

  async create(dto: CreateProdutoDto): Promise<Produto> {
    const fornecedor = await this.fornecedorRepository.findOne({
      where: { cpf_cnpj_fornecedor: dto.fk_cpf_cnpj_fornecedor },
      relations: ['produtos'],
    });
    if (!fornecedor) {
      throw new NotFoundException(
        'fornecedor do produto (cpf_cnpj = ${dto.cpf_cnpj_fornecedor}) não encontrado',
      );
    }
    const novaProduto = this.produtoRepository.create({ ...dto, fornecedor });
    fornecedor.produtos.push(novaProduto);
    await this.fornecedorRepository.save(fornecedor);
    return this.produtoRepository.save(novaProduto);
  }

  async findAll(): Promise<Produto[]> {
    return this.produtoRepository.find();
  }

  async findOne(id: number): Promise<Produto> {
    const forma = await this.produtoRepository.findOneBy({ id_produto: id });
    if (!forma) {
      throw new NotFoundException(`Produto ${id} não encontrada.`);
    }
    return forma;
  }

  async update(id: number, dto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findOne(id);
    const updated = Object.assign(produto, dto);
    if (dto.fk_cpf_cnpj_fornecedor) {
      const novoFornecedor = await this.fornecedorRepository.findOne({
        where: { cpf_cnpj_fornecedor: dto.fk_cpf_cnpj_fornecedor },
        relations: ['produtos'],
      });
      if (!novoFornecedor) {
        throw new NotFoundException(
          'Fornecedor a ser atualizado não encontrado',
        );
      }
      if (
        produto.fornecedor &&
        produto.fornecedor.cpf_cnpj_fornecedor !==
          novoFornecedor.cpf_cnpj_fornecedor
      ) {
        const fornecedorAntigo = await this.fornecedorRepository.findOne({
          where: {
            cpf_cnpj_fornecedor: produto.fornecedor.cpf_cnpj_fornecedor,
          },
          relations: ['produtos'],
        });
        if (fornecedorAntigo) {
          fornecedorAntigo.produtos = fornecedorAntigo.produtos.filter(
            (p) => p.id_produto !== produto.id_produto,
          );
          await this.fornecedorRepository.save(fornecedorAntigo);
        }
      }
      novoFornecedor.produtos.push(updated);
      await this.fornecedorRepository.save(novoFornecedor);
      updated.fornecedor = novoFornecedor;
    }
    return this.produtoRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const produto = await this.produtoRepository.findOne({
      where: { id_produto: id },
    });
    if (!produto) {
      throw new NotFoundException(`Produto ${id} não encontrado.`);
    }
    await this.produtoRepository.remove(produto);
  }
}
