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
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, Customer } from '../../services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ]
})
export class CustomerFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  isLoading = false;
  private cpf_cnpj?: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cpf_cnpj: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required]
    });

    this.cpf_cnpj = this.route.snapshot.paramMap.get('cpf_cnpj') || undefined;
    if (this.cpf_cnpj) {
      this.isLoading = true;
      this.isEdit = true;
      this.api.getCustomer(this.cpf_cnpj).subscribe({
          next: (cust) => {
            this.form.patchValue(cust);
            this.isLoading = false;
          },
          error: (err) => {
            this.showError('Erro ao carregar venda');
            this.isLoading = false;
          }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.showError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    this.isLoading = true;

    const obs = this.isEdit
    ? this.api.updateCustomer(this.cpf_cnpj!, this.form.value)
    : this.api.createCustomer(this.form.value);

    obs.subscribe({
      next: (cliente: Customer) => {
        this.showSuccess('Cliente salvo com sucesso!');
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        this.showError('Erro ao salvar cliente. Por favor, tente novamente.');
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
}
