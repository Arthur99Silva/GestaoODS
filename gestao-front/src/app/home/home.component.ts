// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; // Importe o MatDividerModule
import { ApiService } from '../services/api.service';
import { forkJoin } from 'rxjs';

interface DashboardCard {
  title: string;
  count: number;
  icon: string;
  link: string;
  recentItems: any[]; // Adicionado para guardar os últimos itens
}

// Interfaces para tipar os dados da API
interface Customer { [key: string]: any; }
interface Company { [key: string]: any; }
interface Employee { [key: string]: any; }
interface Supplier { [key: string]: any; }
interface Product { [key: string]: any; }
interface Sale { [key: string]: any; }

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule // Adicione o MatDividerModule aos imports
  ],
})
export class HomeComponent implements OnInit {
  dashboardCards: DashboardCard[] = [];
  isLoading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    forkJoin({
      customers: this.api.getCustomers(),
      companies: this.api.getCompanies(),
      employees: this.api.getEmployees(),
      suppliers: this.api.getSuppliers(),
      products: this.api.getProducts(),
      sales: this.api.getSales()
    }).subscribe({
      next: (response: {
        customers: Customer[];
        companies: Company[];
        employees: Employee[];
        suppliers: Supplier[];
        products: Product[];
        sales: Sale[];
      }) => {
        // Função para pegar os 3 últimos itens e inverter a ordem (mais novo primeiro)
        const getRecentItems = (items: any[]) => items.slice(-3).reverse();

        this.dashboardCards = [
          { title: 'Clientes', count: response.customers.length, icon: 'people', link: '/clientes', recentItems: getRecentItems(response.customers) },
          { title: 'Empresas', count: response.companies.length, icon: 'business', link: '/empresa', recentItems: getRecentItems(response.companies) },
          { title: 'Funcionários', count: response.employees.length, icon: 'badge', link: '/funcionario', recentItems: getRecentItems(response.employees) },
          { title: 'Fornecedores', count: response.suppliers.length, icon: 'local_shipping', link: '/fornecedor', recentItems: getRecentItems(response.suppliers) },
          { title: 'Produtos', count: response.products.length, icon: 'inventory_2', link: '/products', recentItems: getRecentItems(response.products) },
          { title: 'Vendas', count: response.sales.length, icon: 'point_of_sale', link: '/vendas', recentItems: getRecentItems(response.sales) },
        ];
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar dados da dashboard', err);
        this.isLoading = false;
      }
    });
  }
}