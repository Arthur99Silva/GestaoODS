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
import { ApiService, Employee } from '../../services/api.service';
import { isValid as isValidCPF } from '@fnando/cpf';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  private cpf?: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.validateCompanyEmail]],
      cpf: ['', [Validators.required, this.validateCPF]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      endereco: ['', Validators.required],
      contrato: ['', Validators.required],
      data_pagamento: ['', [Validators.required, this.futureDateValidator]],
      data_ferias: ['', [Validators.required, this.pastDateValidator]],
      salario: ['', [Validators.required, Validators.min(1320)]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required]
    });

    this.cpf = this.route.snapshot.paramMap.get('cpf') || undefined;
    if (this.cpf) {
      this.isEdit = true;
      this.api.getEmployee(this.cpf).subscribe(cust => {
        this.form.patchValue(cust);
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

  // Validação de e-mail corporativo
  validateCompanyEmail(control: AbstractControl) {
    const email = control.value;
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(email) || !email.endsWith('.com')) {
      return { invalidCompanyEmail: true };
    }
    return null;
  }

  // Validação de data futura
  futureDateValidator(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today ? null : { pastDate: true };
  }

  // Validação de data passada
  pastDateValidator(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? null : { futureDate: true };
  }

  // Formatação do CPF
  formatCPF(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    this.form.get('cpf')?.setValue(value.substring(0, 14), { emitEvent: false });
  }

  // Formatação do telefone
  formatPhone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2) value = `(${value.substring(0,2)}) ${value.substring(2)}`;
    if (value.length > 10) value = `${value.substring(0,10)}-${value.substring(10,14)}`;
    this.form.get('telefone')?.setValue(value.substring(0, 15), { emitEvent: false });
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    console.log(this.form.value)
  
    const obs = this.isEdit
      ? this.api.updateEmployee(this.cpf!, this.form.value)
      : this.api.createEmployee(this.form.value);
  
    obs.subscribe({
      next: () => this.router.navigate(['/funcionario']),
      error: err => console.error('Erro:', err)
    });
  }
}