import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async create(
    dto: CreateProdutoDto,
  ): Promise<{ message: string; data: Produto }> {
    try {
      const fornecedor = await this.fornecedorRepository.findOne({
        where: { cpf_cnpj_fornecedor: dto.fk_cpf_cnpj_fornecedor },
        relations: ['produtos'],
      });
      if (!fornecedor) {
        throw new NotFoundException(
          `Fornecedor do produto (cpf_cnpj = ${dto.fk_cpf_cnpj_fornecedor}) não encontrado.`,
        );
      }

      const novoProduto = this.produtoRepository.create({ ...dto, fornecedor });
      fornecedor.produtos.push(novoProduto);
      await this.fornecedorRepository.save(fornecedor);
      const produtoSalvo = await this.produtoRepository.save(novoProduto);

      return {
        message: 'Produto criado com sucesso.',
        data: produtoSalvo,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao criar produto.');
    }
  }

  async findAll(): Promise<Produto[]> {
    try {
      return await this.produtoRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao buscar produtos.');
    }
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOneBy({ id_produto: id });
    if (!produto) {
      throw new NotFoundException(`Produto ${id} não encontrado.`);
    }
    return produto;
  }

  async update(
    id: number,
    dto: UpdateProdutoDto,
  ): Promise<{ message: string; data: Produto }> {
    try {
      const produto = await this.findOne(id);
      const updated = Object.assign(produto, dto);

      if (dto.fk_cpf_cnpj_fornecedor) {
        const novoFornecedor = await this.fornecedorRepository.findOne({
          where: { cpf_cnpj_fornecedor: dto.fk_cpf_cnpj_fornecedor },
          relations: ['produtos'],
        });

        if (!novoFornecedor) {
          throw new NotFoundException(
            'Fornecedor a ser atualizado não encontrado.',
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

      const produtoSalvo = await this.produtoRepository.save(updated);

      return {
        message: 'Produto atualizado com sucesso.',
        data: produtoSalvo,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Erro ao atualizar produto ${id}.`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const produto = await this.produtoRepository.findOne({
        where: { id_produto: id },
      });
      if (!produto) {
        throw new NotFoundException(`Produto ${id} não encontrado.`);
      }
      await this.produtoRepository.remove(produto);

      return { message: `Produto ${id} removido com sucesso.` };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Erro ao remover produto ${id}.`);
    }
  }

  async encontrar100MenorQuantidade(): Promise<Produto[]> {
    try {
      return await this.produtoRepository.find({
        order: { qtd_produto: 'ASC' },
        take: 100,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Erro ao buscar produtos com menor quantidade.',
      );
    }
  }
}