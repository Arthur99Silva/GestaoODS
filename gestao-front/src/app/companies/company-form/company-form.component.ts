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
import { ApiService, Company } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class CompanyFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  private cnpj_empresa?: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome_empresa: ['', Validators.required],
      cnpj_empresa: ['', Validators.required],
      endereco: ['', Validators.required],
      razao_social: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required]
    });

    this.cnpj_empresa = this.route.snapshot.paramMap.get('cnpj_empresa') || undefined;
    if (this.cnpj_empresa) {
      this.isEdit = true;
      this.api.getCompany(this.cnpj_empresa).subscribe(comp => {
        console.log(comp);
        this.form.patchValue(comp);
      });
    }
  }

  onSubmit() {
    console.log('onSubmit company:', this.form.value);
    if (this.form.invalid) {
      console.warn('Form inválido', this.form.errors);
      return;
    }
    const obs = this.isEdit
      ? this.api.updateCompany(this.cnpj_empresa!, this.form.value)
      : this.api.createCompany(this.form.value);

    obs.subscribe({
      next: (empresa: Company) => {
        console.log('Empresa salva com sucesso', empresa);
        this.router.navigate(['/empresa']);
      },
      error: err => console.error('Erro ao salvar empresa:', err)
    });
  }
}
