import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Excluir rutas de autenticación
  const authUrls = ['/login', '/register'];
  const isAuthUrl = authUrls.some(url => req.url.includes(url));

  let authReq = req;

  if (token && !isAuthUrl) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el token ha expirado o no es válido (401 Unauthorized)
      if (error.status === 401 && !isAuthUrl) {
        // Hacer logout automáticamente y redirigir al login
        authService.logout();
        router.navigate(['/login']);
      }

      // Re-lanzar el error para que los componentes puedan manejarlo si es necesario
      return throwError(() => error);
    })
  );
};