// src/app/supplier/supplier-list/supplier-list.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'; // Adicionado ViewChild, AfterViewInit
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ApiService, Supplier } from '../../services/api.service';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Importações para o Paginator
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';

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
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css'],
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
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule // Adicionado MatPaginatorModule
  ]
})
export class SupplierListComponent implements OnInit, AfterViewInit { // Implementa AfterViewInit
  dataSource = new MatTableDataSource<Supplier>([]); // Inicializa com array vazio
  originalSuppliers: Supplier[] = [];
  filterValue: string = '';

  columns = ['nome_fornecedor', 'cpf_cnpj_fornecedor', 'email', 'telefone', 'endereco', 'actions'];

  // Referência ao MatPaginator no template
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getSuppliers().subscribe(list => {
      this.originalSuppliers = list;
      this.dataSource.data = list;
      // Conexão inicial do paginador pode ser tentada aqui se o paginator já estiver disponível,
      // mas ngAfterViewInit é mais garantido para a primeira atribuição.
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngAfterViewInit() {
    // Garante que o paginador seja atribuído ao dataSource após a view ser inicializada.
    // Verifica se dataSource tem dados e se o paginador ainda não foi atribuído.
    if (this.dataSource.data.length > 0 && !this.dataSource.paginator && this.paginator) {
      this.dataSource.paginator = this.paginator;
    } else if (!this.dataSource.paginator && this.paginator) { // Caso os dados cheguem depois ou ngOnInit não pegue
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter() {
    const filterText = this.filterValue.trim().toLowerCase();

    if (!filterText) {
      this.dataSource.data = this.originalSuppliers;
    } else {
      this.dataSource.data = this.originalSuppliers.filter(supplier =>
      (supplier.nome_fornecedor?.toLowerCase().includes(filterText) ||
        supplier.cpf_cnpj_fornecedor?.toLowerCase().includes(filterText) ||
        supplier.email?.toLowerCase().includes(filterText) ||
        supplier.telefone?.toLowerCase().includes(filterText))
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