import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, Employee } from '../../services/api.service';

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
    MatButtonModule
  ]
})
export class EmployeeFormComponent implements OnInit {
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
      nome: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
      contrato: ['', Validators.required],
      data_pagamento: ['', Validators.required],
      data_ferias: ['', Validators.required],
      salario: ['', Validators.required],
      senha: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) {
      this.isEdit = true;
      this.api.getEmployee(this.id).subscribe(cust => {
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
        ? this.api.updateEmployee(this.id!, this.form.value)
        : this.api.createEmployee(this.form.value);
  
      obs.subscribe({
        next: (funcionario: Employee) => {
          console.log('Funcionario salvo com sucesso', funcionario);
          this.router.navigate(['/funcionario']);
        },
        error: err => console.error('Erro ao salvar funcionario:', err)
      });
    }
}