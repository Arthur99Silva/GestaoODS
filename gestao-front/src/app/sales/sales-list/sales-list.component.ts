// src/app/companies/sales-list/sales-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ApiService } from '../../services/api.service';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

function getPortuguesePaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Itens por página:';
  paginatorIntl.nextPageLabel = 'Próxima página';
  paginatorIntl.previousPageLabel = 'Página anterior';
  paginatorIntl.firstPageLabel = 'Primeira página';
  paginatorIntl.lastPageLabel = 'Última página';
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    return `${page * pageSize + 1} - ${Math.min((page + 1) * pageSize, length)} de ${length}`;
  };
  return paginatorIntl;
}

@Component({
  standalone: true,
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: getPortuguesePaginatorIntl() }
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    DateFormatPipe,
    MatPaginatorModule
  ]
})
export class SalesListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  columns = ['valor_total', 'data_venda', 'nota_fiscal', 'fk_cpf_cnpj_cliente', 
             'nome_forma_pagamento', 'fk_cpf_funcionario', 'actions'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadSales();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadSales() {
    this.api.getSales().subscribe({
      next: (list) => {
        this.dataSource.data = list;
        // Set pagination options
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Erro ao carregar as vendas', err)
    });
  }
}
