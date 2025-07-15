/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AppModule } from './../src/app.module';
import * as fs from 'fs/promises';

describe('FuncionarioController (e2e)', () => {
  let app: INestApplication;
  let axiosInstance: AxiosInstance;
  let jwtToken = '';
  const baseUrl = '/funcionario';

  const testFuncionario = {
    cpf: '12345678900',
    nome: 'Funcionario Teste',
    telefone: '123456789',
    email: 'funcionario@teste.com',
    endereco: 'Rua Funcionário, 123',
    contrato: 'CLT',
    data_pagamento: new Date(),
    data_ferias: new Date(),
    salario: 3500,
    senha: 'senha_funcionario',
    role: 'ADMIN',
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

    // Registra usuário de teste se não existir
    try {
      await axiosInstance.post('/auth/register', testUser);
    } catch {
      // Ignora erro de registro duplicado
    }

    // Faz login
    const res = await axiosInstance.post('/auth/login', testUser);
    jwtToken = res.data.token;
  });

  it('[POST] /funcionario - deve criar funcionário', async () => {
    const testName = '[CREATE] Criação de funcionário';
    try {
      const res = await axiosInstance.post(baseUrl, testFuncionario, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      expect(res.status).toBe(201);
      expect(res.data.data).toHaveProperty('cpf', testFuncionario.cpf);
      logOk(`${testName}: Funcionário criado CPF ${testFuncionario.cpf}`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[GET] /funcionario - deve listar funcionários', async () => {
    const testName = '[FIND ALL] Listar funcionários';
    try {
      const res = await axiosInstance.get(baseUrl, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      logOk(`${testName}: Total ${res.data.length} funcionários`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[GET] /funcionario/:cpf - deve buscar funcionário por CPF', async () => {
    const testName = '[FIND ONE] Buscar por CPF';
    try {
      const res = await axiosInstance.get(`${baseUrl}/${testFuncionario.cpf}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('cpf', testFuncionario.cpf);
      logOk(`${testName}: Encontrado CPF ${testFuncionario.cpf}`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[PATCH] /funcionario/:cpf - deve atualizar funcionário', async () => {
    const testName = '[UPDATE] Atualizar funcionário';
    try {
      const updateData = { telefone: '987654321' };
      const res = await axiosInstance.patch(
        `${baseUrl}/${testFuncionario.cpf}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        },
      );
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('telefone', updateData.telefone);
      logOk(`${testName}: Telefone atualizado para ${updateData.telefone}`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  afterAll(async () => {
    await fs.writeFile('funcionario-success-log.txt', logSucesso, 'utf-8');
    await fs.writeFile('funcionario-error-log.txt', logErro, 'utf-8');
    await app.close();
  });
});
