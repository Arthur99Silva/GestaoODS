import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FornecedorController } from './fornecedor.controller';
import { FornecedorService } from './fornecedor.service';
import { Fornecedor } from './entity/fornecedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fornecedor])],
  controllers: [FornecedorController],
  providers: [FornecedorService],
})
export class FornecedorModule {}
