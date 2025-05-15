import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemProdutoController } from "./item-produto.controller";
import { ItemProdutoService } from "./item-produto.service";
import { ItemProduto } from "./entite/item-produtos.entity";
import { Pedido } from "src/Pedido/entite/pedido.entity";
import { PedidoModule } from "src/Pedido/pedido.module";
import { Produto } from "src/Produto/entity/produto.entity";
import { ProdutoModule } from "src/Produto/produto.module";

@Module({
    imports: [TypeOrmModule.forFeature([ItemProduto, Pedido, Produto]),PedidoModule, ProdutoModule],
    controllers: [ItemProdutoController],
    providers: [ItemProdutoService],
})
export class ItemProdutoModule {}
