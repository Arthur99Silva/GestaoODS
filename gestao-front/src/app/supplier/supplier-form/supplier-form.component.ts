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
import { ApiService, Supplier } from '../../services/api.service';
import { isValid as isValidCPF } from '@fnando/cpf';
import { isValid as isValidCNPJ } from '@fnando/cnpj';

@Component({
  standalone: true,
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class SupplierFormComponent implements OnInit {
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
      nome_fornecedor: ['', Validators.required],
      cpf_cnpj: ['', [Validators.required, this.validateCpfCnpj]],
      email: ['', [Validators.required, Validators.email, this.validateCompanyEmail]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      endereco: ['', Validators.required]
    });

    this.cpf_cnpj = this.route.snapshot.paramMap.get('cpf_cnpj') || undefined;
    if (this.cpf_cnpj) {
      this.isEdit = true;
      this.api.getSupplier(this.cpf_cnpj).subscribe(comp => {
        this.form.patchValue(comp);
      });
    }
  }

  // Validação de CPF/CNPJ
  validateCpfCnpj(control: AbstractControl) {
    const value = control.value.replace(/\D/g, '');
    if (value.length === 11 && !isValidCPF(value)) {
      return { invalidCpf: true };
    }
    if (value.length === 14 && !isValidCNPJ(value)) {
      return { invalidCnpj: true };
    }
    return null;
  }

  // Validação de e-mail corporativo
  validateCompanyEmail(control: AbstractControl) {
    const email = control.value;
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(email) || !email.endsWith('.com.br')) {
      return { invalidCompanyEmail: true };
    }
    return null;
  }

  // Formatação de CPF/CNPJ
  formatCpfCnpj(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      // Formata CPF
      if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, '$1.$2');
      if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    } else {
      // Formata CNPJ
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    this.form.get('cpf_cnpj')?.setValue(value.substring(0, 18), { emitEvent: false });
  }

  // Formatação de telefone
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

    const obs = this.isEdit
      ? this.api.updateSupplier(this.cpf_cnpj!, this.form.value)
      : this.api.createSupplier(this.form.value);

    obs.subscribe({
      next: () => this.router.navigate(['/fornecedor']),
      error: err => console.error('Erro:', err)
    });
  }
}