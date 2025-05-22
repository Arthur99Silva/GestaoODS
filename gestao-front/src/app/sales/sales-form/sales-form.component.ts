import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule, 
  AbstractControl 
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, Sales } from '../../services/api.service';
import { isValid as isValidCPF } from '@fnando/cpf';

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
    MatButtonModule
  ]
})
export class SalesFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  private id?: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      valor_total: ['', [Validators.required, Validators.min(0.01)]],
      data_venda: ['', [Validators.required, this.pastDateValidator]],
      nota_fiscal: ['', Validators.required],
      fk_cpf_cnpj_cliente: ['', [Validators.required, this.validateCpfCnpj]],
      fk_forma_pagamento: ['', [Validators.required, Validators.min(1)]],
      fk_cpf_funcionario: ['', [Validators.required, this.validateCPF]]
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) {
      this.isEdit = true;
      this.api.getSale(this.id).subscribe(comp => {
        this.form.patchValue({
          ...comp,
          fk_cpf_cnpj_cliente: comp.cliente?.cpf_cnpj,
          fk_cpf_funcionario: comp.funcionario?.cpf,
          fk_forma_pagamento: comp.forma_pagamento?.id_forma_pagamento,
          valor_total: String(comp.valor_total),
          data_venda: comp.data_venda?.slice(0, 10)
        });
      });
    }
  }

  // Validação de CPF
  validateCPF(control: AbstractControl) {
    const value = control.value.replace(/\D/g, '');
    if (!isValidCPF(value)) {
      return { invalidCpf: true };
    }
    return null;
  }

  // Validação de CPF/CNPJ para cliente
  validateCpfCnpj(control: AbstractControl) {
    const value = control.value.replace(/\D/g, '');
    if (value.length === 11 && !isValidCPF(value)) {
      return { invalidCpf: true };
    }
    if (value.length === 14 && !isValidCPF(value)) {
      return { invalidCnpj: true };
    }
    return null;
  }

  // Validação de data passada
  pastDateValidator(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today ? null : { futureDate: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const formData = {
      ...this.form.value,
      valor_total: parseFloat(this.form.value.valor_total),
      fk_forma_pagamento: parseInt(this.form.value.fk_forma_pagamento)
    };

    const obs = this.isEdit
      ? this.api.updateSales(this.id!, formData)
      : this.api.createSales(formData);

    obs.subscribe({
      next: () => this.router.navigate(['/vendas']),
      error: err => console.error('Erro:', err)
    });
  }
}