import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FormaPagamento } from "./entite/forma-pagamento.entity";
import { FormaPagamentoSeedService } from "./forma-pagamento_seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([FormaPagamento])],
  providers: [FormaPagamentoSeedService],
  exports: [FormaPagamentoSeedService],
})
export class FormaPagamentoModule {}
