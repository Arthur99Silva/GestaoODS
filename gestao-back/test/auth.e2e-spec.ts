/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AppModule } from './../src/app.module';
import * as fs from 'fs/promises';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let axiosInstance: AxiosInstance;
  let jwtToken = '';
  const baseUrl = '/auth';

  const testUser = {
    email: 'email_tupla0@email.com',
    senha: 'senha_tupla0',
  };

  const wrongPassword = {
    email: 'email_tupla0@email.com',
    senha: 'senha_errada',
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
  });

  it('[POST] /auth/register - deve registrar um novo usuário', async () => {
    const testName = '[REGISTER] Cadastro válido';
    try {
      const res = await axiosInstance.post(`${baseUrl}/register`, testUser);
      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('email', testUser.email);
      logOk(`${testName}: Sucesso para ${testUser.email}`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[POST] /auth/login - deve logar com credenciais corretas', async () => {
    const testName = '[LOGIN] Login válido';
    try {
      const res = await axiosInstance.post(`${baseUrl}/login`, testUser);
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('token');
      jwtToken = res.data.token;
      logOk(`${testName}: Token gerado ${jwtToken}`);
    } catch (err: any) {
      logFail(`${testName}: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  });

  it('[POST] /auth/login - não deve logar com senha errada', async () => {
    const testName = '[LOGIN] Falha de login senha errada';
    let falhouComoEsperado = false;

    try {
      await axiosInstance.post(`${baseUrl}/login`, wrongPassword);
      logFail(`${testName}: Login indevido aceito!`);
    } catch (err: any) {
      expect(err.response.status).toBe(401);
      falhouComoEsperado = true;
      logOk(`${testName}: Bloqueio de login inválido OK`);
    }

    if (!falhouComoEsperado) {
      throw new Error(`${testName}: Login inválido passou!`);
    }
  });

  it('[POST] /auth/register - não deve permitir registro duplicado', async () => {
    const testName = '[REGISTER] Registro duplicado';
    let falhouComoEsperado = false;

    try {
      await axiosInstance.post(`${baseUrl}/register`, testUser);
      logFail(`${testName}: Registro duplicado aceito!`);
    } catch (err: any) {
      expect(err.response.status).toBe(409);
      falhouComoEsperado = true;
      logOk(`${testName}: Registro duplicado bloqueado OK`);
    }

    if (!falhouComoEsperado) {
      throw new Error(`${testName}: Registro duplicado passou!`);
    }
  });

  afterAll(async () => {
    await fs.writeFile('auth-success-log.txt', logSucesso, 'utf-8');
    await fs.writeFile('auth-error-log.txt', logErro, 'utf-8');
    await app.close();
  });
});
