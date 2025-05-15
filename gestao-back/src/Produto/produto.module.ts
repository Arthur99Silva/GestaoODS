import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { Produto } from './entity/produto.entity';
import { Fornecedor } from 'src/Fornecedor/entity/fornecedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Fornecedor])],
  controllers: [ProdutoController],
  providers: [ProdutoService],
})
export class ProdutoModule {}
