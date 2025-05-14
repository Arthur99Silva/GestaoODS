// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,   // *ngIf, *ngFor
    RouterLink,     // routerLink nas buttons
    MatCardModule,  // <mat-card>
    MatButtonModule // <button mat-raised-button>
  ]
})
export class HomeComponent {}