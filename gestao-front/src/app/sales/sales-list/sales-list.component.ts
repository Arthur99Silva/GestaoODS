// src/app/companies/sales-list/sales-list.component.ts
import { Component, OnInit } from '@angular/core';
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
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    FormsModule,MatFormFieldModule, // <-- Adicione esta linha
    MatInputModule, // <-- Adicione esta linha
    FormsModule // <-- Certifique-se que está presente
  ],
  providers: [CurrencyPipe, DatePipe]
})
export class SalesListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  originalData: any[] = []; // Armazena a lista completa
  cpfFilter: string = ''; // Variável para o filtro
  columns = ['valor_total', 'data_venda', 'actions'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getSales().subscribe(list => {
      this.originalData = list; // Salva os dados originais
      this.dataSource.data = this.originalData;
    });
  }

  // Método para aplicar o filtro
  applyFilter() {
    const filterValue = this.cpfFilter.trim().toLowerCase();
    this.dataSource.data = this.originalData.filter(sale => 
      sale.fk_cpf_funcionario.toLowerCase().includes(filterValue)
    );
  }
}
