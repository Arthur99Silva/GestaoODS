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
    MatButtonModule
  ]
})
export class CustomerFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  private cpf_cnpj?: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
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
      this.isEdit = true;
      this.api.getCustomer(this.cpf_cnpj).subscribe(cust => {
        this.form.patchValue(cust);
      });
    }
  }

  onSubmit() {
    console.log('onSubmit chamado:', this.form.value);
    if (this.form.invalid) {
      console.warn('Form inválido', this.form.errors);
      return;
    }
    const obs = this.isEdit
      ? this.api.updateCustomer(this.cpf_cnpj!, this.form.value)
      : this.api.createCustomer(this.form.value);

    obs.subscribe({
      next: (cliente: Customer) => {
        console.log('Cliente salvo com sucesso', cliente);
        this.router.navigate(['/clientes']);
      },
      error: err => console.error('Erro ao salvar cliente:', err)
    });
  }
}
