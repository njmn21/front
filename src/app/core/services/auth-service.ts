import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Usando signals para estado reactivo
  private tokenSignal = signal<string | null>(null);
  private userSignal = signal<any>(null);

  // Computed properties
  isAuthenticated = computed(() => {
    const token = this.tokenSignal();
    if (!token) return false;

    // Verificar si el token ha expirado
    return !this.isTokenExpired(token);
  });
  currentUser = computed(() => this.userSignal());

  private readonly API_URL = environment.API_URL;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor() {
    // Limpiar datos corruptos si existen
    this.cleanupCorruptedData();
    // Cargar token y usuario del localStorage al inicializar
    this.loadFromStorage();
    // Verificar si el token ha expirado al inicializar
    this.checkTokenExpiration();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/Auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.result) {
            this.setToken(response.result);
            // Decodificar el JWT para extraer información del usuario
            const userInfo = this.decodeJWT(response.result);
            this.setUser(userInfo);
          }
        })
      );
  }

  logout(): void {
    this.clearStorage();
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const signalToken = this.tokenSignal();
    const storageToken = localStorage.getItem(this.TOKEN_KEY);

    // Verificar que el token no sea 'null' o 'undefined' como string
    if (signalToken && signalToken !== 'null' && signalToken !== 'undefined') {
      return signalToken;
    }

    if (storageToken && storageToken !== 'null' && storageToken !== 'undefined') {
      return storageToken;
    }

    return null;
  }

  private setToken(token: string): void {
    this.tokenSignal.set(token);
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: any): void {
    if (user) {
      this.userSignal.set(user);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);

    if (token && token !== 'null' && token !== 'undefined') {
      this.tokenSignal.set(token);
    }

    if (user && user !== 'null' && user !== 'undefined') {
      try {
        this.userSignal.set(JSON.parse(user));
      } catch (error) {
        this.clearStorage(); // Limpiar datos corruptos
      }
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private cleanupCorruptedData(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);

    // Verificar si los datos están corruptos
    if (token === 'null' || token === 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }

    if (user === 'null' || user === 'undefined') {
      localStorage.removeItem(this.USER_KEY);
    }

    // Verificar si el user data es JSON válido
    if (user && user !== 'null' && user !== 'undefined') {
      try {
        JSON.parse(user);
      } catch (error) {
        localStorage.removeItem(this.USER_KEY);
      }
    }
  }

  private decodeJWT(token: string): any {
    try {
      // Dividir el token en sus partes
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token JWT inválido');
      }

      // Decodificar el payload (parte central)
      const payload = parts[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const parsed = JSON.parse(decodedPayload);

      // Extraer información relevante del token
      return {
        id: parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || parsed.sub || parsed.id,
        email: parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || parsed.email,
        name: parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || parsed.name,
        exp: parsed.exp
      };
    } catch (error) {
      return {
        id: null,
        email: null,
        name: null,
        exp: null
      };
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeJWT(token);
      if (!decoded.exp) return true;

      // exp está en segundos, Date.now() está en milisegundos
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true; // Si hay error, considerar expirado
    }
  }

  private checkTokenExpiration(): void {
    const token = this.tokenSignal();
    if (token && this.isTokenExpired(token)) {
      // Si el token ha expirado, hacer logout automático
      this.logout();
    }
  }
}