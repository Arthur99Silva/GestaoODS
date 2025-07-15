/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AppModule } from '../src/app.module';
import * as fs from 'fs/promises';

describe('FornecedorController (e2e)', () => {
  let app: INestApplication;
  let axiosInstance: AxiosInstance;
  let jwtToken = '';
  const baseUrl = '/fornecedor';

  const testFornecedor = {
    cpf_cnpj_fornecedor: '12345678900',
    nome_fornecedor: 'Fornecedor Teste',
    telefone_fornecedor: '123456789',
    email_fornecedor: 'fornecedor@teste.com',
    endereco_fornecedor: 'Rua Fornecedor, 123',
  };

  const testUser = {
    email: 'email_tupla0@email.com',
    senha: 'senha_tupla0',
  };

  let logSucesso = '';
  let logErro = '';

  function logOk(msg: string) {
    logSucesso += `✅ ${msg}\n`;
  }

  function logFail(msg: string) {
    logErro += `❌ ${msg}\n`;
  }

  beforeAll(async () => {
    jest.setTimeout(20000);
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

    // Registra usuário (ignora erro)
    try {
      await axiosInstance.post('/auth/register', testUser);
    } catch {
      // ignora
    }

    // Login
    const res = await axiosInstance.post('/auth/login', testUser);
    jwtToken = res.data.token;
  });

  it('[POST] /fornecedor - deve criar fornecedor', async () => {
    const testName = '[CREATE] Criação de fornecedor';
    try {
      const res = await axiosInstance.post(baseUrl, testFornecedor, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      expect(res.status).toBe(201);
      expect(res.data.data).toHaveProperty(
        'cpf_cnpj_fornecedor',
        testFornecedor.cpf_cnpj_fornecedor,
      );
      logOk(
        `${testName}: Fornecedor criado ${testFornecedor.cpf_cnpj_fornecedor}`,
      );
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[GET] /fornecedor - deve listar fornecedores', async () => {
    const testName = '[FIND ALL] Listar fornecedores';
    try {
      const res = await axiosInstance.get(baseUrl, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      logOk(`${testName}: Total ${res.data.length} fornecedores`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[GET] /fornecedor/:id - deve buscar fornecedor por CPF/CNPJ', async () => {
    const testName = '[FIND ONE] Buscar por CPF/CNPJ';
    try {
      const res = await axiosInstance.get(
        `${baseUrl}/${testFornecedor.cpf_cnpj_fornecedor}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        },
      );
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty(
        'cpf_cnpj_fornecedor',
        testFornecedor.cpf_cnpj_fornecedor,
      );
      logOk(`${testName}: Encontrado ${testFornecedor.cpf_cnpj_fornecedor}`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[PATCH] /fornecedor/:id - deve atualizar fornecedor', async () => {
    const testName = '[UPDATE] Atualizar fornecedor';
    try {
      const updateData = { telefone_fornecedor: '987654321' };
      const res = await axiosInstance.patch(
        `${baseUrl}/${testFornecedor.cpf_cnpj_fornecedor}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        },
      );
      expect(res.status).toBe(200);
      expect(res.data.data).toHaveProperty(
        'telefone_fornecedor',
        updateData.telefone_fornecedor,
      );
      logOk(
        `${testName}: Telefone atualizado para ${updateData.telefone_fornecedor}`,
      );
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[DELETE] /fornecedor/:id - deve remover fornecedor', async () => {
    const testName = '[REMOVE] Remover fornecedor';
    try {
      const res = await axiosInstance.delete(
        `${baseUrl}/${testFornecedor.cpf_cnpj_fornecedor}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        },
      );
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('message');
      logOk(`${testName}: Removido ${testFornecedor.cpf_cnpj_fornecedor}`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  afterAll(async () => {
    await fs.writeFile('fornecedor-success-log.txt', logSucesso, 'utf-8');
    await fs.writeFile('fornecedor-error-log.txt', logErro, 'utf-8');
    await app.close();
  });
});
