// src/app/companies/company-list/company-list.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ApiService, Company } from '../../services/api.service';

// Importações para o Filtro
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
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
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
    // Módulos para Filtro
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    // Módulo para Paginator
    MatPaginatorModule
  ]
})
export class CompanyListComponent implements OnInit, AfterViewInit { // Implementa AfterViewInit
  dataSource = new MatTableDataSource<Company>([]); // Usar a interface Company e inicializar
  originalCompanies: Company[] = []; // Para guardar a lista original
  filterValue: string = ''; // Variável para o ngModel do filtro

  columns = ['nome_empresa', 'cnpj_empresa', 'razao_social', 'email', 'telefone', 'endereco', 'actions'];

  // Referência ao MatPaginator no template
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getCompanies().subscribe(list => {
      this.originalCompanies = list;
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

  applyFilter() {
    const filterText = this.filterValue.trim().toLowerCase();

    if (!filterText) {
      this.dataSource.data = this.originalCompanies;
    } else {
      this.dataSource.data = this.originalCompanies.filter(company =>
      (company.nome_empresa?.toLowerCase().includes(filterText) ||
        company.cnpj_empresa?.toLowerCase().includes(filterText) ||
        company.email?.toLowerCase().includes(filterText) ||
        company.telefone?.toLowerCase().includes(filterText))
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