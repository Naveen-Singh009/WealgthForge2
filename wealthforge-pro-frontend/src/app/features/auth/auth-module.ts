import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing-module';
import { LoginComponent } from './login/login';
import { LoginOtpComponent } from './login-otp/login-otp';
import { RegisterComponent } from './register/register';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [LoginComponent, LoginOtpComponent, RegisterComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, AuthRoutingModule],
})
export class AuthModule {}
