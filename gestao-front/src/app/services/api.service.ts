// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
}

export interface Customer {
  id: string;
  nome: string;
  email: string;
  cpf_cnpj: string;
  telefone: string;
  endereco: string;
}

export interface Sales {
  id: string;
  valor_total: number;
  data_venda: string;
  nota_fiscal: string;
  fk_cpf_cnpj_cliente: string;
  fk_forma_pagamento: number;
  fk_cpf_funcionario: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
  contrato: string;
  data_pagamento: string;
  data_ferias: string;
  salario: number;
  senha: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // === Autenticação ===
  login(payload: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, payload);
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/register`, user);
  }

  // === Clientes ===
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/clientes`);
  }

  getCustomer(cpf: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/clientes/${cpf}`);
  }

  createCustomer(customer: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/clientes`, customer);
  }

  updateCustomer(cpf: string, customer: Partial<Omit<Customer, 'id'>>): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/clientes/${cpf}`, customer);
  }

  deleteCustomer(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clientes/${cpf}`);
  }

  // === Empresas ===
  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/companies`);
  }

  getCompany(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/companies/${id}`);
  }

  createCompany(company: Omit<Company, 'id'>): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}/companies`, company);
  }

  updateCompany(id: string, company: Partial<Omit<Company, 'id'>>): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/companies/${id}`, company);
  }

  deleteCompany(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/companies/${id}`);
  }

  // === Funcionários ===

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/funcionario`);
  }
  
  getEmployee(cpf: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/funcionario/${cpf}`);
  }
  
  createEmployee(emp: Omit<Employee,'id'>): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/funcionario`, emp);
  }
  
  updateEmployee(cpf: string, emp: Partial<Omit<Employee,'id'>>): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/funcionario/${cpf}`, emp);
  }
  
  deleteEmployee(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/funcionario/${cpf}`);
  }

  // === Pedidos ===
  getSales(): Observable<Sales[]> {
    return this.http.get<Sales[]>(`${this.baseUrl}/pedido`);
  }

  getSale(id: string): Observable<Sales> {
    return this.http.get<Sales>(`${this.baseUrl}/pedido/${id}`);
  }

  createSales(sales: Omit<Sales, 'id'>): Observable<Sales> {
    return this.http.post<Sales>(`${this.baseUrl}/pedido`, sales);
  }

  updateSales(id: string, sales: Partial<Omit<Sales, 'id'>>): Observable<Sales> {
    return this.http.put<Sales>(`${this.baseUrl}/pedido/${id}`, sales);
  }

  deleteSales(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/pedido/${id}`);
  }
}
