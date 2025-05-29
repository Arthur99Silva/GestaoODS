// src/app/companies/sales-list/sales-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

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
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class SalesListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  columns = ['valor_total', 'data_venda', 'nota_fiscal', 'fk_cpf_cnpj_cliente',
    'nome_forma_pagamento', 'fk_cpf_funcionario', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dateFilter = new FormControl<Date | null>(null);
  filteredData: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadSales();

    // Listen for date filter changes
    this.dateFilter.valueChanges.subscribe((date: Date | null) => {
      this.applyDateFilter(date);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadSales() {
    this.api.getSales().subscribe({
      next: (list) => {
        this.dataSource.data = list;
        this.filteredData = [...list];
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Error loading sales', err)
    });
  }

  applyDateFilter(filterDate: Date | null) {
    if (!filterDate) {
      this.dataSource.data = [...this.filteredData];
      return;
    }

    const filterValue = this.formatDateForFilter(filterDate);
    this.dataSource.data = this.filteredData.filter(sale => {
      const saleDate = new Date(sale.data_venda);
      return this.formatDateForFilter(saleDate) === filterValue;
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private formatDateForFilter(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  clearDateFilter() {
    this.dateFilter.setValue(null);
  }
}