import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PedidoController } from "./pedido.controller";
import { PedidoService } from "./pedido.service";
import { Pedido } from "./entite/pedido.entity";
import { Cliente } from "src/Cliente/entite/cliente.entity";
import { ClienteModule } from "src/Cliente/cliente.module";
import { Funcionario } from "src/Funcionario/entite/funcionario.entity";
import { FuncionarioModule } from "src/Funcionario/funcionario.module";
import { ItemProduto } from "src/Item_Produto/entite/item-produtos.entity";
import { ItemProdutoModule } from "src/Item_Produto/item-produto.module";
import { FormaPagamento } from "src/Forma_Pagamento/entite/forma-pagamento.entity";
import { FormaPagamentoModule } from "src/Forma_Pagamento/forma-pagamento.module";


@Module({
    imports: [TypeOrmModule.forFeature([Pedido, Cliente, Funcionario, FormaPagamento, ItemProduto]), 
    ClienteModule, FuncionarioModule, FormaPagamentoModule, ItemProdutoModule],
    controllers: [PedidoController],
    providers: [PedidoService],
    exports: [PedidoService],
})
export class PedidoModule {}
