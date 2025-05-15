// src/app/customers/customer-list/customer-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink            // para uso de routerLink nos botões
  ]
})
export class CustomerListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  columns = ['nome', 'email', 'cpf_cnpj', 'telefone', 'endereco', 'actions'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCustomers().subscribe(list => {
      this.dataSource.data = list;
    });
  }
}
