import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, Sales, Customer, Employee, Payment } from '../../services/api.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class SalesFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  isLoading = false;
  private id?: string;

  // Dropdown options
  customers: Customer[] = [];
  payment_methods: Payment[] = [];
  employees: Employee[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<Date>,
    private snackBar: MatSnackBar
  ) {
    this.dateAdapter.setLocale('pt-BR');
  }

  ngOnInit() {
    this.initializeForm();
    this.loadDropdownData();

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) {
      this.loadSaleData();
    }
  }

  private initializeForm() {
    this.form = this.fb.group({
      valor_total: ['', [Validators.required, Validators.min(0.01)]],
      data_venda: ['', Validators.required],
      nota_fiscal: ['', Validators.required],
      fk_cpf_cnpj_cliente: ['', Validators.required],
      fk_forma_pagamento: ['', Validators.required],
      fk_cpf_funcionario: ['', Validators.required]
    });
  }

  private loadDropdownData() {
    this.isLoading = true;

    // Load customers
    this.api.getCustomers().subscribe({
      next: (customers) => this.customers = customers,
      error: (err) => this.showError('Erro ao carregar clientes')
    });

    // Load payment methods
    this.api.getPayments().subscribe({
      next: (payments) => this.payment_methods = payments,
      error: (err) => this.showError('Erro ao carregar formas de pagamento')
    });

    // Load employees
    this.api.getEmployees().subscribe({
      next: (employees) => this.employees = employees,
      complete: () => this.isLoading = false,
      error: (err) => this.showError('Erro ao carregar funcionários')
    });
  }

  private loadSaleData() {
    this.isLoading = true;
    this.isEdit = true;

    this.api.getSale(this.id!).subscribe({
      next: (comp) => {
        let saleDate = comp.data_venda ? this.parseBackendDate(comp.data_venda) : null;
        this.form.patchValue({
          ...comp,
          fk_cpf_cnpj_cliente: comp.cliente?.cpf_cnpj,
          fk_cpf_funcionario: comp.funcionario?.cpf,
          fk_forma_pagamento: comp.forma_pagamento?.id_forma_pagamento,
          valor_total: String(comp.valor_total),
          data_venda: saleDate
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.showError('Erro ao carregar venda');
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.showError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    this.isLoading = true;
    const formData = {
      ...this.form.value,
      valor_total: parseFloat(this.form.value.valor_total),
      fk_forma_pagamento: parseInt(this.form.value.fk_forma_pagamento),
      data_venda: this.convertToBackendFormat(this.form.value.data_venda)
    };

    const obs = this.isEdit
      ? this.api.updateSales(this.id!, formData)
      : this.api.createSales(formData);

    obs.subscribe({
      next: (venda: Sales) => {
        this.showSuccess('Venda salva com sucesso!');
        this.router.navigate(['/vendas']);
      },
      error: (err) => {
        this.showError('Erro ao salvar venda. Por favor, tente novamente.');
        this.isLoading = false;
      }
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private parseBackendDate(isoString: string): Date {
    const date = new Date(isoString);
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
  }

  private convertToBackendFormat(date: Date): string {
    if (!date) return '';

    const utcDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0, 0, 0, 0
      )
    );

    return utcDate.toISOString();
  }
}