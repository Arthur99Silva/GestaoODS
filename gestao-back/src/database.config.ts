import { DataSource } from 'typeorm';
import { Cliente } from './Cliente/entite/cliente.entity';
import { Empresa } from './Empresa/entity/empresa.entity';
import { Funcionario } from './Funcionario/entite/funcionario.entity';
import { Fornecedor } from './Fornecedor/entity/fornecedor.entity';
import { Produto } from './Produto/entity/produto.entity';
import { Pedido } from './Pedido/entite/pedido.entity';
import { ItemProduto } from './Item_Produto/entite/item-produtos.entity';
import { FormaPagamento } from './Forma_Pagamento/entite/forma-pagamento.entity';
import { AuthData } from './Auth/entity/auth-data.entity';

// Alteração: O DataSource agora é configurado pela URL do banco de dados
// e inclui a configuração SSL necessária para o ambiente de produção.
const dataSourceOptions = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // <-- USA A VARIÁVEL DE AMBIENTE DO RENDER
  ssl: {
    rejectUnauthorized: false, // <-- NECESSÁRIO PARA CONEXÕES NO RENDER
  },
  entities: [
    Cliente,
    Empresa,
    Funcionario,
    Fornecedor,
    Produto,
    Pedido,
    ItemProduto,
    FormaPagamento,
    AuthData,
  ],
  synchronize: true, // Manter como true para o projeto acadêmico
});

export default dataSourceOptions;