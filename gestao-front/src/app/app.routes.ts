// src/app/app.routes.ts
import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register-user/register-user.component').then(m => m.RegisterUserComponent) },

  // rota para Home
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },

  // Clientes
  { path: 'clientes', loadComponent: () => import('./customers/customer-list/customer-list.component').then(m => m.CustomerListComponent) },
  { path: 'clientes/new', loadComponent: () => import('./customers/customer-form/customer-form.component').then(m => m.CustomerFormComponent) },

  // Empresas
  { path: 'empresas', loadComponent: () => import('./companies/company-list/company-list.component').then(m => m.CompanyListComponent) },
  { path: 'empresas/new', loadComponent: () => import('./companies/company-form/company-form.component').then(m => m.CompanyFormComponent) },

  // Funcionários
  {
    path: 'employees',
    loadComponent: () => import('./employees/employee-list/employee-list.component').then(m => m.EmployeeListComponent)
  },
  {
    path: 'employees/new',
    loadComponent: () => import('./employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
  },
  {
    path: 'employees/:id',
    loadComponent: () => import('./employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
  },

  // Vendas
  { path: 'vendas', loadComponent: () => import('./sales/sales-list/sales-list.component').then(m => m.SalesListComponent) },
  { path: 'vendas/new', loadComponent: () => import('./sales/sales-form/sales-form.component').then(m => m.SalesFormComponent) },


  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];