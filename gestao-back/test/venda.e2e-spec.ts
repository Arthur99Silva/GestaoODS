import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AppModule } from './../src/app.module';
import * as fs from 'fs/promises';

describe('PedidoController (e2e) com Axios e logs', () => {
  let app: INestApplication;
  let axiosInstance: AxiosInstance;
  let jwtToken: string;
  let pedidoId: number;

  const clienteCpfCnpj = '22225678901';

  const pedidoPayload = {
    valor_total: 299.99,
    data_venda: '2024-06-09T14:30:00.000Z',
    nota_fiscal: 'NF123456789',
    fk_cpf_cnpj_cliente: clienteCpfCnpj,
    fk_forma_pagamento: 2,
    fk_cpf_funcionario: '12345678901',
    itens: [
      { fk_produto: 1, qtd_item_produto: 2 },
      { fk_produto: 2, qtd_item_produto: 1 },
    ],
  };

  const pedidoInvalido = {
    valor_total: "trezentos",  // inválido: deve ser número
    data_venda: '',            // obrigatório e vazio
    fk_cpf_cnpj_cliente: '',   // obrigatório e vazio
    fk_forma_pagamento: null,  // obrigatório
    fk_cpf_funcionario: 12345, // deve ser string, não número
    itens: "item errado",      // deve ser array
  };

  let logSucesso = '';
  let logErroValidacao = '';

  function logSuccess(testName: string, message: string) {
    logSucesso += `✅ ${testName}: ${message}\n`;
  }

  function logError(testName: string, error: any) {
    let msg = error.response?.data?.message || error.message || 'Erro desconhecido';
    if (Array.isArray(msg)) {
      msg = msg.join(' | ');
    }
    logSucesso += `❌ ${testName}: ${msg}\n`;
  }

  function logValidationError(testName: string, error: any) {
    const data = error.response?.data || { message: 'Erro desconhecido', statusCode: '---', error: 'Erro' };
    const status = data.statusCode || '---';
    const errorType = data.error || 'Erro';
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

    // Ajuste o login conforme seu endpoint e dados reais:
    const loginResponse = await axiosInstance.post('/auth/login', {
      email: 'Pusuario@exemplo.com',
      senha: '123456',
    });
    jwtToken = loginResponse.data.access_token || loginResponse.data.token;
  });

  it('POST /pedido válido', async () => {
    const testName = 'POST /pedido válido';
    try {
      const response = await axiosInstance.post('/pedido', pedidoPayload, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      expect(response.status).toBe(201);
      const pedidoData = response.data.data || response.data;
      expect(pedidoData).toHaveProperty('nota_fiscal', pedidoPayload.nota_fiscal);

      pedidoId = pedidoData.id_pedido || pedidoData.id;

      logSuccess(testName, `Pedido criado com sucesso - nota_fiscal: ${pedidoPayload.nota_fiscal}`);
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Se houver conflito, loga erro específico
        const msg = error.response.data.message || 'Conflito ao criar pedido';
        logError(testName, { message: msg });
      } else {
        logError(testName, error);
      }
      throw error;
    }
  });

  it('POST /pedido inválido (espera erro 400)', async () => {
    const testName = 'POST /pedido inválido';
    try {
      await axiosInstance.post('/pedido', pedidoInvalido, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      logValidationError(testName, 'Esperava erro, mas requisição teve sucesso inesperado.');
      throw new Error('Esperava erro, mas requisição teve sucesso inesperado.');
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      logValidationError(testName, error);
    }
  });

  it('GET /pedido - lista todos os pedidos', async () => {
    const testName = 'GET /pedido';
    try {
      const response = await axiosInstance.get('/pedido', {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      expect(response.status).toBe(200);
      const pedidosArray = response.data.data || response.data;
      expect(Array.isArray(pedidosArray)).toBe(true);

      logSuccess(testName, `Pedidos listados: ${pedidosArray.length} registros`);
    } catch (error) {
      logError(testName, error);
      throw error;
    }
  });

  it('GET /pedido/:id - retorna pedido por ID', async () => {
    const testName = 'GET /pedido/:id';
    try {
      const response = await axiosInstance.get(`/pedido/${pedidoId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      expect(response.status).toBe(200);
      const pedidoData = response.data.data || response.data;
      expect(pedidoData).toHaveProperty('id_pedido', pedidoId);

      logSuccess(testName, `Pedido encontrado ID ${pedidoId}`);
    } catch (error) {
      logError(testName, error);
      throw error;
    }
  });

  it('GET /pedido/cliente/:cpf_cnpj - retorna pedidos por CPF', async () => {
    const testName = 'GET /pedido/cliente/:cpf_cnpj';
    try {
      const response = await axiosInstance.get(`/pedido/cliente/${clienteCpfCnpj}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
        params: { orderBy: 'valor_total', order: 'DESC' },
      });

      expect(response.status).toBe(200);
      const pedidosArray = response.data.data || response.data;
      expect(Array.isArray(pedidosArray)).toBe(true);

      logSuccess(testName, `Pedidos para cliente listados: ${pedidosArray.length} registros`);
    } catch (error) {
      logError(testName, error);
      throw error;
    }
  });

  afterAll(async () => {
    await fs.writeFile('pedido-test-log.txt', logSucesso, 'utf-8');
    await fs.writeFile('pedido-error-log.txt', logErroValidacao, 'utf-8');
    await app.close();
  });
});
