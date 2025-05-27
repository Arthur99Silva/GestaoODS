import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ApiService, Employee } from '../../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatPaginator,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class EmployeeListComponent implements OnInit {
  dataSource = new MatTableDataSource<Employee>();
  columns: string[] = ['nome', 'email', 'cpf', 'telefone', 'endereco', 'contrato', 'data_pagamento', 'data_ferias', 'salario', 'role', 'actions'];
  filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService) {} // Certifique-se que ApiService está fornecido no nível adequado

  ngOnInit() {
    this.api.getEmployees().subscribe((list: Employee[]) => {
      this.dataSource.data = list;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data: Employee, filter: string) => {
        return data.cpf.includes(filter);
      };
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
  }
}