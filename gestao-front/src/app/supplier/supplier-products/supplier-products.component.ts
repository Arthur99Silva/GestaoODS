import { Component } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { ApiService, Supplier, Product } from '../../services/api.service';
import { isValid as isValidCPF } from '@fnando/cpf';
import { isValid as isValidCNPJ } from '@fnando/cnpj';

@Component({
  standalone: true,
  selector: 'app-supplier-products',
  templateUrl: './supplier-products.component.html',
  styleUrls: ['./supplier-products.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule
  ]
})
export class SupplierProductsComponent {
  searchForm: FormGroup;
  supplier: Supplier | null = null;
  products: Product[] = [];
  displayedColumns: string[] = ['nome', 'preco', 'estoque'];

  constructor(
    private fb: FormBuilder,
    private api: ApiService
  ) {
    this.searchForm = this.fb.group({
      cpf_cnpj: ['', [Validators.required, this.validateCpfCnpj]]
    });
  }

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
    this.searchForm.get('cpf_cnpj')?.setValue(value.substring(0, 18), { emitEvent: false });
  }

  search() {
    if (this.searchForm.invalid) return;

    const cpf_cnpj = this.searchForm.value.cpf_cnpj.replace(/\D/g, '');
    
    this.api.getSupplierProducts(cpf_cnpj).subscribe({
      next: (result: { supplier: Supplier, products: Product[] }) => {
        this.supplier = result.supplier;
        this.products = result.products;
      },
      error: (err) => {
        console.error('Erro na busca:', err);
        this.supplier = null;
        this.products = [];
      }
    });
  }
}