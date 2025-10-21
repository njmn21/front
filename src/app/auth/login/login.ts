import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../core/services/auth-service';
import { LoginRequest } from '../../core/interfaces/auth';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CardModule,
    FloatLabel,
    ButtonModule,
    MessageModule,
    InputTextModule,
    PasswordModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
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
          this.errorMessage.set('Error al iniciar sesión. Verifique sus credenciales.' + error);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        }
      });
    }
  }
}
