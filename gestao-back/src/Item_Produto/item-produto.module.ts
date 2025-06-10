import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemProdutoController } from "./item-produto.controller";
import { ItemProdutoService } from "./item-produto.service";
import { ItemProduto } from "./entite/item-produtos.entity";
import { Produto } from "src/Produto/entity/produto.entity";
import { ProdutoModule } from "src/Produto/produto.module";

@Module({
    imports: [TypeOrmModule.forFeature([ItemProduto, Produto]), ProdutoModule],
    controllers: [ItemProdutoController],
    providers: [ItemProdutoService],
    exports: [ItemProdutoService], // exporte se for necessário em outros módulos

})
export class ItemProdutoModule { }
