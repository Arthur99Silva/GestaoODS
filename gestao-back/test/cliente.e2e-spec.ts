import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AppModule } from './../src/app.module';
import * as fs from 'fs/promises';

describe('ClienteController (e2e) com Axios e logs', () => {
  let app: INestApplication;
  let axiosInstance: AxiosInstance;
  let jwtToken: string;
  const baseUrl = '/clientes';

  const clienteOriginal = {
    cpf_cnpj: '',
    nome: 'Eduardo da Silva',
    email: 'eduardo.silva@example.com',
    telefone: '(11) 98765-4321',
    endereco: 'Rua das Flores, 123 - São Paulo, SP',
  };

  // Dados com erros para validação
  const clienteComErros = {
    cpf_cnpj: '',     // obrigatório e vazio (erro)
    nome: 123,        // deve ser string (erro)
    email: 456,       // deve ser string (erro, mas opcional)
    telefone: '',     // obrigatório e vazio (erro)
    endereco: null,   // deve ser string se informado (erro)
  };

  let logSucesso = '';
  let logErroValidacao = '';

  function gerarCpfCnpjFake() {
    const prefixo = '3322112225678';
    const sufixo = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return prefixo + sufixo;
  }

  function logSuccess(testName: string, message: string) {
    logSucesso += `✅ ${testName}: ${message}\n`;
  }

  function logError(testName: string, error: any) {
    let msg = error.response?.data?.message || error.message || 'Erro desconhecido';
    // Se for array, converte para string
    if (Array.isArray(msg)) {
      msg = msg.join(' | ');
    }
    logSucesso += `❌ ${testName}: ${msg}\n`;
  }

  function logValidationError(testName: string, error: any) {
    let data = error.response?.data;
    if (!data) data = { message: 'Erro desconhecido' };

    let status = data.statusCode || '---';
    let errorType = data.error || 'Erro';

    let msg = data.message;
    if (Array.isArray(msg)) {
      msg = msg.join(' | ');
    } else if (typeof msg !== 'string') {
      msg = JSON.stringify(msg);
    }

    logErroValidacao += `❌ ${testName} - ${status} ${errorType}: ${msg}\n`;
  }

  beforeAll(async () => {
    jest.setTimeout(30000);

    clienteOriginal.cpf_cnpj = gerarCpfCnpjFake();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const server = app.getHttpServer();
    const address = server.address();
    let baseURL: string;
    if (typeof address === 'string' || address === null) {
      baseURL = 'http://localhost:3000';
    } else {
      baseURL = `http://localhost:${address.port}`;
    }
    axiosInstance = axios.create({ baseURL });

    // Login para pegar token JWT
    const loginResponse = await axiosInstance.post('/auth/login', {
      email: 'Pusuario@exemplo.com',  // ajuste para seu login real
      senha: '123456',                // ajuste para sua senha real
    });
    jwtToken = loginResponse.data.token || loginResponse.data.access_token;
  });

  it('POST /clientes - cria um novo cliente (válido)', async () => {
    const testName = 'POST /clientes válido';
    try {
      const response = await axiosInstance.post(baseUrl, clienteOriginal, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('cpf_cnpj', clienteOriginal.cpf_cnpj);
      logSuccess(testName, `Cliente criado com cpf_cnpj ${clienteOriginal.cpf_cnpj}`);
    } catch (error: any) {
      // Se der conflito (409), loga especificamente
      if (error.response?.status === 409) {
        const msg = error.response.data.message || 'Conflito ao criar cliente';
        logError(testName, { message: msg });
      } else {
        logError(testName, error);
      }
      throw error;
    }
  });

  it('POST /clientes - cria cliente com erros de validação (espera erro 400)', async () => {
    const testName = 'POST /clientes inválido com erros do DTO';
    try {
      await axiosInstance.post(baseUrl, clienteComErros, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      logValidationError(testName, 'Esperava erro, mas requisição teve sucesso inesperado.');
      throw new Error('Esperava erro, mas requisição teve sucesso inesperado.');
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      logValidationError(testName, error);
    }
  });

  afterAll(async () => {
    // Salva os logs em arquivos separados
    await fs.writeFile('cliente-test-log.txt', logSucesso, 'utf-8');
    await fs.writeFile('cliente-error-log.txt', logErroValidacao, 'utf-8');
    await app.close();
  });
});
