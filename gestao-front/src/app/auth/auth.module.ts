import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

// importe os componentes standalone
import { LoginComponent } from './login/login.component';
import { RegisterUserComponent } from './register-user/register-user.component';

@NgModule({
  // não há mais 'declarations'
  imports: [
    CommonModule,
    AuthRoutingModule,
    // aqui entram os standalone components
    LoginComponent,
    RegisterUserComponent
  ]
})
export class AuthModule { }
