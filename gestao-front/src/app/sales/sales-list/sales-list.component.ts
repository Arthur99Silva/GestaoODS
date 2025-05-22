// src/app/companies/sales-list/sales-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  standalone: true,
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    DateFormatPipe // Add the pipe here
  ]
})
export class SalesListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  columns = ['valor_total', 'data_venda', 'nota_fiscal', 'fk_cpf_cnpj_cliente', 'nome_forma_pagamento', 'fk_cpf_funcionario', 'actions'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getSales().subscribe(list => {
      console.log(list);
      this.dataSource.data = list;
    });
  }
}
