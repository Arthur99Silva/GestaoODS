// src/app/customers/customer-list/customer-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ApiService } from '../../services/api.service';

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
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: getPortuguesePaginatorIntl() }
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatPaginatorModule
  ]
})
export class CustomerListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  columns = ['nome', 'email', 'cpf_cnpj', 'telefone', 'endereco', 'actions'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadCustomers() {
    this.api.getCustomers().subscribe({
      next: (list) => {
        this.dataSource.data = list;
        // Set pagination options
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Erro ao carregar os clientes', err)
    });
  }
}
