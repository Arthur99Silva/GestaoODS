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
import { ApiService, Supplier } from '../../services/api.service';

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
      cpf_cnpj: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required]
    });

    console.log(this.route.snapshot.paramMap.get('cpf_cnpj'));

    this.cpf_cnpj = this.route.snapshot.paramMap.get('cpf_cnpj') || undefined;
    if (this.cpf_cnpj) {
      this.isEdit = true;
      this.api.getSupplier(this.cpf_cnpj).subscribe(comp => {
        this.form.patchValue(comp);
      });
    }
  }

  onSubmit() {
    console.log('onSubmit supplier:', this.form.value);
    if (this.form.invalid) {
      console.warn('Form inválido', this.form.errors);
      return;
    }
    const obs = this.isEdit
      ? this.api.updateSupplier(this.cpf_cnpj!, this.form.value)
      : this.api.createSupplier(this.form.value);

    obs.subscribe({
      next: (fornecedor: Supplier) => {
        console.log('Fornecedor salvo com sucesso', fornecedor);
        this.router.navigate(['/fornecedor']);
      },
      error: err => console.error('Erro ao salvar fornecedor:', err)
    });
  }
}
