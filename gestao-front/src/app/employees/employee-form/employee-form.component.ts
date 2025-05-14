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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.id = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.id) {
      this.isEdit = true;
      this.api.getEmployee(this.id).subscribe(emp => this.form.patchValue(emp));
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const obs = this.isEdit
      ? this.api.updateEmployee(this.id!, this.form.value)
      : this.api.createEmployee(this.form.value);
    obs.subscribe({
      next: () => this.router.navigate(['/employees']),
      error: err => console.error('Erro:', err)
    });
  }
}