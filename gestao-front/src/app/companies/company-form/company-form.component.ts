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
  private id?: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) {
      this.isEdit = true;
      this.api.getCompany(this.id).subscribe(comp => {
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
      ? this.api.updateCompany(this.id!, this.form.value)
      : this.api.createCompany(this.form.value);

    obs.subscribe({
      next: (empresa: Company) => {
        console.log('Empresa salva com sucesso', empresa);
        this.router.navigate(['/empresas']);
      },
      error: err => console.error('Erro ao salvar empresa:', err)
    });
  }
}
