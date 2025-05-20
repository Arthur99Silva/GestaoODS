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
import { ApiService, Sales } from '../../services/api.service';

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
      valor_total: ['', Validators.required],
      data_venda: ['', Validators.required],
      nota_fiscal: ['', Validators.required],
      fk_cpf_cnpj_cliente: ['', Validators.required],
      fk_forma_pagamento: ['', Validators.required],
      fk_cpf_funcionario: ['', Validators.required]
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) {
      this.isEdit = true;
      this.api.getSale(this.id).subscribe(comp => {
        this.form.patchValue(comp);
      });
    }
  }

  onSubmit() {
    this.form.value.valor_total = parseFloat(this.form.value.valor_total);
    this.form.value.fk_forma_pagamento = parseInt(this.form.value.fk_forma_pagamento);
    console.log('onSubmit sales:', this.form.value);
    if (this.form.invalid) {
      console.warn('Form inválido', this.form.errors);
      return;
    }
    const obs = this.isEdit
      ? this.api.updateSales(this.id!, this.form.value)
      : this.api.createSales(this.form.value);

    obs.subscribe({
      next: (venda: Sales) => {
        console.log('Venda salva com sucesso', venda);
        this.router.navigate(['/vendas']);
      },
      error: err => console.error('Erro ao salvar venda:', err)
    });
  }
}
