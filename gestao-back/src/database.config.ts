import { Cliente } from "./Cliente/entite/cliente.entity";
import { FormaPagamento } from "./Forma_Pagamento/entite/forma-pagamento.entity";
import { Funcionario } from "./Funcionario/entite/funcionario.entity";
import { ItemProduto } from "./Item_Produto/entite/item-produtos.entity";
import { Pedido } from "./Pedido/entite/pedido.entity";
import { Empresa } from "./Empresa/entity/empresa.entity";
import { Fornecedor } from "./Fornecedor/entity/fornecedor.entity";
import { Produto } from "./Produto/entity/produto.entity";
import { DataSource } from 'typeorm';
import { AuthData } from "./Auth/entity/auth-data.entity";

const dataSourceOptions = new DataSource({
    type: 'postgres',
    host: 'localhost', // Endereço do servidor do banco de dados --
    port: 5432, // Porta padrão do PostgreSQL
    username: 'postgres',    // Nome do usuário do banco de dados --
    password: '1234',   // Senha do banco de dados --
    database: 'ods', // Nome do banco de dadosw
    entities: [
        Cliente,
        FormaPagamento,
        Funcionario,
        ItemProduto,
        Pedido,
        Empresa,
        Fornecedor,
        Produto,
        AuthData,
    ], // Entidades
    synchronize: true, // Sincroniza o esquema do banco de dados, apenas para desenvolvimento
    logging: true, //Ativa logs para visualizarmos possíveis erros,
    migrations: [
        'src/migrations/*.ts', // Caminho para as migrações
    ],
})

export default dataSourceOptions;