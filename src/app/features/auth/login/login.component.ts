import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { LoginRequest } from '../../../core/interfaces/auth';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    MessageModule
  ],
  template: `
    <div class="login-container">
      <p-card header="Iniciar Sesión" class="login-card">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="email">Email:</label>
            <input 
              pInputText 
              id="email" 
              type="email" 
              formControlName="email" 
              placeholder="Ingrese su email"
              class="w-full"
            />
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <small class="p-error">El email es requerido y debe ser válido</small>
            }
          </div>
          
          <div class="field">
            <label for="password">Contraseña:</label>
            <input 
              pInputText 
              id="password" 
              type="password" 
              formControlName="password" 
              placeholder="Ingrese su contraseña"
              class="w-full"
            />
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <small class="p-error">La contraseña es requerida</small>
            }
          </div>
          
          @if (errorMessage()) {
            <p-message severity="error" [text]="errorMessage()" styleClass="w-full"></p-message>
          }
          
          <div class="field">
            <p-button 
              type="submit" 
              label="Iniciar Sesión" 
              [disabled]="loginForm.invalid || loading()"
              [loading]="loading()"
              styleClass="w-full"
            ></p-button>
          </div>
        </form>
      </p-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .login-card {
      width: 100%;
      max-width: 400px;
      margin: 20px;
    }
    
    .field {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      this.authService.login(this.loginForm.value as LoginRequest).subscribe({
        next: () => {
          this.router.navigate(['/inicio']);
        },
        error: (error: any) => {
          this.errorMessage.set('Error al iniciar sesión. Verifique sus credenciales.');
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        }
      });
    }
  }
}