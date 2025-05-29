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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService, Customer } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

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
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class CustomerListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  originalCustomers: Customer[] = []; // Para guardar a lista original
  filterValue: string = ''; // Variável para o ngModel do filtro

  columns = ['nome', 'email', 'cpf_cnpj', 'telefone', 'endereco', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getCustomers().subscribe(list => {
      this.originalCustomers = list;
      this.dataSource.data = list;
      // Conexão inicial do paginador
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngAfterViewInit() {
    // Garante que o paginador seja atribuído ao dataSource após a view ser inicializada.
    if (this.dataSource.data.length > 0 && !this.dataSource.paginator && this.paginator) {
      this.dataSource.paginator = this.paginator;
    } else if (!this.dataSource.paginator && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadCustomers() {
    this.api.getCustomers().subscribe({
      next: (list) => {
        this.dataSource.data = list;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Erro ao carregar os clientes', err)
    });
  }

  applyFilter() {
    const filterText = this.filterValue.trim().toLowerCase();

    if (!filterText) {
      this.dataSource.data = this.originalCustomers;
    } else {
      this.dataSource.data = this.originalCustomers.filter(customer =>
      (customer.cpf_cnpj?.toLowerCase().includes(filterText) ||
        customer.nome?.toLowerCase().includes(filterText) ||
        customer.email?.toLowerCase().includes(filterText) ||
        customer.telefone?.toLowerCase().includes(filterText))
      );
    }

    // Após filtrar, se o paginador existir, volte para a primeira página
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter() {
    this.filterValue = '';
    this.applyFilter();
  }
}