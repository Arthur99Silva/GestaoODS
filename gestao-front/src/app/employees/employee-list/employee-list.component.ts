import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ApiService, Employee } from '../../services/api.service';

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
    RouterLink
  ]
})
export class EmployeeListComponent implements OnInit {
  dataSource = new MatTableDataSource<Employee>();
  columns = ['nome', 'email', 'cpf', 'telefone', 'endereco', 'contrato', 'data_pagamento', 'data_ferias', 'salario', 'role', 'actions'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getEmployees().subscribe(list => this.dataSource.data = list);
  }
}