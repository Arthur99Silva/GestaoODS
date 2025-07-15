/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AppModule } from './../src/app.module';
import * as fs from 'fs/promises';

describe('EmpresaController (e2e)', () => {
  let app: INestApplication;
  let axiosInstance: AxiosInstance;
  let jwtToken = '';
  const baseUrl = '/empresa';

  const testEmpresa = {
    nome_empresa: 'Empresa Teste Ltda',
    cnpj_empresa: '12345678000199',
    razao_social: 'Empresa Teste Razão',
    telefone: '123456789',
    email: 'contato@empresateste.com',
    endereco: 'Rua Teste, 123',
  };

  const testUser = {
    email: 'email_tupla0@email.com', // Ajuste conforme seu usuário válido
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

    try {
      await axiosInstance.post('/auth/register', testUser);
    } catch {
      // Ignora erro (usuário já cadastrado)
    }

    const res = await axiosInstance.post('/auth/login', testUser);
    jwtToken = res.data.token;
  });

  it('[POST] /empresa - deve criar uma empresa', async () => {
    const testName = '[CREATE] Criação de empresa válida';
    try {
      const res = await axiosInstance.post(baseUrl, testEmpresa, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty(
        'data.cnpj_empresa',
        testEmpresa.cnpj_empresa,
      );
      logOk(`${testName}: Empresa criada com CNPJ ${testEmpresa.cnpj_empresa}`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[GET] /empresa - deve listar todas as empresas', async () => {
    const testName = '[FIND ALL] Listagem de empresas';
    try {
      const res = await axiosInstance.get(baseUrl, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      logOk(`${testName}: Lista retornada com ${res.data.length} empresas`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[GET] /empresa/:id - deve retornar empresa pelo CNPJ', async () => {
    const testName = '[FIND ONE] Busca por CNPJ';
    try {
      const res = await axiosInstance.get(
        `${baseUrl}/${testEmpresa.cnpj_empresa}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        },
      );
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('cnpj_empresa', testEmpresa.cnpj_empresa);
      logOk(
        `${testName}: Empresa encontrada com CNPJ ${testEmpresa.cnpj_empresa}`,
      );
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[PATCH] /empresa/:id - deve atualizar empresa', async () => {
    const testName = '[UPDATE] Atualização de empresa';
    try {
      const updateData = { telefone: '987654321' };
      const res = await axiosInstance.patch(
        `${baseUrl}/${testEmpresa.cnpj_empresa}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        },
      );
      expect(res.status).toBe(200);
      expect(res.data.data).toHaveProperty('telefone', updateData.telefone);
      logOk(
        `${testName}: Empresa atualizada com novo telefone ${updateData.telefone}`,
      );
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[DELETE] /empresa/:id - deve remover empresa', async () => {
    const testName = '[REMOVE] Remoção de empresa';
    try {
      const res = await axiosInstance.delete(
        `${baseUrl}/${testEmpresa.cnpj_empresa}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        },
      );
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('message');
      logOk(
        `${testName}: Empresa removida com CNPJ ${testEmpresa.cnpj_empresa}`,
      );
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  afterAll(async () => {
    await fs.writeFile('empresa-success-log.txt', logSucesso, 'utf-8');
    await fs.writeFile('empresa-error-log.txt', logErro, 'utf-8');
    await app.close();
  });
});
