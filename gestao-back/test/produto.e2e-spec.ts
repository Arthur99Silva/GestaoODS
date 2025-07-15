/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AppModule } from './../src/app.module';
import * as fs from 'fs/promises';

describe('ProdutoController (e2e)', () => {
  let app: INestApplication;
  let axiosInstance: AxiosInstance;
  let jwtToken = '';
  const baseUrl = '/produto';

  const testUser = {
    email: 'email_tupla0@email.com',
    senha: 'senha_tupla0',
  };

  // Fornecedor E2E
  const testFornecedor = {
    cpf_cnpj_fornecedor: '12345678000199',
    nome_fornecedor: 'Fornecedor E2E',
    telefone_fornecedor: '99999999999',
    email_fornecedor: 'fornecedor@e2e.com',
    endereco_fornecedor: 'Rua Teste E2E, 123',
  };

  // Produto E2E (cpf_cnpj será setado com o que criar)
  const testProduto = {
    nome_produto: 'Produto Teste E2E',
    qtd_produto: 20,
    valor_custo: 50.5,
    valor_venda: 80.0,
    fk_cpf_cnpj_fornecedor: testFornecedor.cpf_cnpj_fornecedor,
  };

  let createdProdutoId: number;

  let logSucesso = '';
  let logErro = '';

  function logOk(msg: string) {
    logSucesso += `✅ ${msg}\n`;
  }

  function logFail(msg: string) {
    logErro += `❌ ${msg}\n`;
  }

  beforeAll(async () => {
    jest.setTimeout(30000);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const server = app.getHttpServer();
    const address = server.address();
    const baseURL =
      typeof address === 'string' || address === null
        ? 'http://localhost:3000'
        : `http://localhost:${address.port}`;

    axiosInstance = axios.create({ baseURL });

    try {
      await axiosInstance.post('/auth/register', testUser);
    } catch {
      // Ignora se já existir
    }

    const res = await axiosInstance.post('/auth/login', testUser);
    jwtToken = res.data.token;

    // Cria o fornecedor antes
    try {
      await axiosInstance.post('/fornecedor', testFornecedor, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      logOk('[SETUP] Fornecedor criado');
    } catch (err: any) {
      if (err.response?.status === 409) {
        logOk('[SETUP] Fornecedor já existia');
      } else {
        logFail(
          `[SETUP] Falha ao criar fornecedor: ${err.response?.data?.message || err.message}`,
        );
        throw err;
      }
    }
  });

  it('[POST] /produto - deve criar produto', async () => {
    const testName = '[CREATE] Criação do produto';
    try {
      const res = await axiosInstance.post(baseUrl, testProduto, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('data.id_produto');
      createdProdutoId = res.data.data.id_produto;
      logOk(`${testName}: Produto ID ${createdProdutoId} criado`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[GET] /produto - deve listar todos os produtos', async () => {
    const testName = '[FIND ALL] Listagem de produtos';
    try {
      const res = await axiosInstance.get(baseUrl, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      logOk(`${testName}: ${res.data.length} produtos encontrados`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[GET] /produto/:id - deve buscar produto por ID', async () => {
    const testName = '[FIND ONE] Buscar produto por ID';
    try {
      const res = await axiosInstance.get(`${baseUrl}/${createdProdutoId}`);
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('id_produto', createdProdutoId);
      logOk(`${testName}: Produto ID ${createdProdutoId} encontrado`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[GET] /produto/menor-quantidade - deve buscar 100 com menor quantidade', async () => {
    const testName = '[GET] Menor quantidade';
    try {
      const res = await axiosInstance.get(`${baseUrl}/menor-quantidade`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      logOk(`${testName}: ${res.data.length} produtos retornados`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[PATCH] /produto/:id - deve atualizar produto', async () => {
    const testName = '[UPDATE] Atualização do produto';
    try {
      const res = await axiosInstance.patch(
        `${baseUrl}/${createdProdutoId}`,
        { qtd_produto: 30 },
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        },
      );

      expect(res.status).toBe(200);
      expect(res.data.data.qtd_produto).toBe(30);
      logOk(`${testName}: Produto ID ${createdProdutoId} atualizado`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[DELETE] /produto/:id - deve remover produto', async () => {
    const testName = '[DELETE] Exclusão do produto';
    try {
      const res = await axiosInstance.delete(`${baseUrl}/${createdProdutoId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      expect(res.status).toBe(200);
      logOk(`${testName}: Produto ID ${createdProdutoId} removido`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  afterAll(async () => {
    // Remover fornecedor se quiser
    // await axiosInstance.delete(`/fornecedor/${testFornecedor.cpf_cnpj_fornecedor}`, {
    //   headers: { Authorization: `Bearer ${jwtToken}` },
    // });

    await fs.writeFile('produto-success-log.txt', logSucesso, 'utf-8');
    await fs.writeFile('produto-error-log.txt', logErro, 'utf-8');
    await app.close();
  });
});
