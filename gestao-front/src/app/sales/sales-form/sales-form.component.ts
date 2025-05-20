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
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, Sales } from '../../services/api.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
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
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('pt-BR');
  }

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
        console.log(comp);

        let saleDate = comp.data_venda ? this.parseBackendDate(comp.data_venda) : null;

        this.form.patchValue({
          ...comp,
          fk_cpf_cnpj_cliente: comp.cliente?.cpf_cnpj,
          fk_cpf_funcionario: comp.funcionario?.cpf,
          fk_forma_pagamento: comp.forma_pagamento?.id_forma_pagamento,
          valor_total: String(comp.valor_total),
          data_venda: saleDate
        });
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      console.warn('Form inválido', this.form.errors);
      return;
    }

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
        console.log('Venda salva com sucesso', venda);
        this.router.navigate(['/vendas']);
      },
      error: err => console.error('Erro ao salvar venda:', err)
    });
  }


  private parseBackendDate(isoString: string): Date {
    // Parse the ISO string but ignore timezone (treat as local date)
    const date = new Date(isoString);
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
  }

  private convertToBackendFormat(date: Date): string {
    if (!date) return '';
    
    // Create date in UTC to avoid timezone shifts
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