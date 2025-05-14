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
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
}

export interface Sales {
  id: string;
  value: number;
  date: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
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
    return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/customers/${id}`);
  }

  createCustomer(customer: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/customers`, customer);
  }

  updateCustomer(id: string, customer: Partial<Omit<Customer, 'id'>>): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/customers/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/customers/${id}`);
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

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/employees`);
  }
  
  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/employees/${id}`);
  }
  
  createEmployee(emp: Omit<Employee,'id'>): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/employees`, emp);
  }
  
  updateEmployee(id: string, emp: Partial<Omit<Employee,'id'>>): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/employees/${id}`, emp);
  }
  
  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/employees/${id}`);
  }

  // === Vendas ===
  getSales(): Observable<Sales[]> {
    return this.http.get<Sales[]>(`${this.baseUrl}/sales`);
  }

  getSale(id: string): Observable<Sales> {
    return this.http.get<Sales>(`${this.baseUrl}/sales/${id}`);
  }

  createSales(sales: Omit<Sales, 'id'>): Observable<Sales> {
    return this.http.post<Sales>(`${this.baseUrl}/sales`, sales);
  }

  updateSales(id: string, sales: Partial<Omit<Sales, 'id'>>): Observable<Sales> {
    return this.http.put<Sales>(`${this.baseUrl}/sales/${id}`, sales);
  }

  deleteSales(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sales/${id}`);
  }
}
