// src/app/sales/sales-list/sales-list.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'; // Adicionado ViewChild, AfterViewInit
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ApiService, Sales } from '../../services/api.service';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

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
    DateFormatPipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule, // Adicionado MatPaginatorModule
  ],
  providers: [
    CurrencyPipe,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    {provide: MatPaginatorIntl, useValue: getPortuguesePaginatorIntl()}
  ]
})
export class SalesListComponent implements OnInit, AfterViewInit { // Implementa AfterViewInit
  dataSource = new MatTableDataSource<Sales>([]); // Inicializa com array vazio
  originalData: Sales[] = [];

  funcionarioCpfFilter: string = '';
  funcionarioNomeFilter: string = '';
  dataVendaFilter: Date | null = null;

  columns = ['valor_total', 'data_venda', 'nota_fiscal', 'fk_cpf_cnpj_cliente',
    'nome_forma_pagamento', 'fk_cpf_funcionario'];

  // Referência ao MatPaginator no template
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private api: ApiService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.api.getSales().subscribe(list => {
      this.originalData = list;
      this.dataSource.data = this.originalData;
      // O paginador será conectado em ngAfterViewInit ou quando os dados estiverem prontos
      // Se o paginator já estiver disponível, podemos tentar conectá-lo aqui também
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngAfterViewInit() {
    // Conecta o paginador ao dataSource após a view ser inicializada
    // Isso garante que o paginator está disponível
    if (this.dataSource.data.length > 0 && !this.dataSource.paginator) {
      this.dataSource.paginator = this.paginator;
    } else if (!this.dataSource.paginator && this.paginator) { // Caso os dados cheguem depois
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter() {
    const cpfFuncFilterValue = this.funcionarioCpfFilter.trim().toLowerCase();
    const cpfClienteFilterValue = this.funcionarioNomeFilter.trim().toLowerCase();
    let dataVendaFilterString = '';
    if (this.dataVendaFilter) {
      dataVendaFilterString = this.datePipe.transform(this.dataVendaFilter, 'dd/MM/yyyy')?.toLowerCase() || '';
    }

    this.dataSource.data = this.originalData.filter(sale => {
      const matchesCpfFuncionario = cpfFuncFilterValue
        ? sale.funcionario?.cpf?.toLowerCase().includes(cpfFuncFilterValue)
        : true;

      const matchesCpfCliente = cpfClienteFilterValue
        ? sale.cliente?.cpf_cnpj?.toLowerCase().includes(cpfClienteFilterValue)
        : true;

      const saleDateFormatted = sale.data_venda ? this.datePipe.transform(sale.data_venda, 'dd/MM/yyyy')?.toLowerCase() : '';
      const matchesDataVenda = dataVendaFilterString
        ? saleDateFormatted === dataVendaFilterString
        : true;

      return matchesCpfFuncionario && matchesCpfCliente && matchesDataVenda;
    });

    // Após filtrar, se o paginador existir, volte para a primeira página
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters() {
    this.funcionarioCpfFilter = '';
    this.funcionarioNomeFilter = '';
    this.dataVendaFilter = null;
    this.applyFilter();
  }

  onDateFilterChange() {
    this.applyFilter();
  }
}