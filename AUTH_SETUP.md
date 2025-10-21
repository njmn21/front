# Configuración de Autenticación JWT

## Archivos creados/modificados:

### 1. Interceptor HTTP JWT
- **Archivo**: `src/app/core/interceptor/auth-interceptor.ts`
- **Función**: Añade automáticamente el token JWT a todas las peticiones HTTP (excepto login/register)

### 2. Servicio de Autenticación
- **Archivo**: `src/app/core/services/auth-service.ts`
- **Función**: Maneja login, logout, almacenamiento del token y estado de autenticación
- **Características**:
  - Usa Angular Signals para estado reactivo
  - Almacena token en localStorage
  - Computed properties para estado de autenticación

### 3. Guard de Autenticación
- **Archivo**: `src/app/core/guards/auth.guard.ts`
- **Función**: Protege rutas que requieren autenticación
- **Uso**: Redirige a login si el usuario no está autenticado

### 4. Componente de Login
- **Archivo**: `src/app/features/auth/login/login.component.ts`
- **Función**: Interfaz de usuario para iniciar sesión
- **Características**:
  - Validación de formularios
  - Integración con PrimeNG
  - Manejo de errores

### 5. Componente de Menú de Usuario
- **Archivo**: `src/app/shared/components/user-menu/user-menu.component.ts`
- **Función**: Muestra información del usuario y botón de logout

### 6. Configuración de la Aplicación
- **Archivo**: `src/app/app.config.ts`
- **Modificación**: Añadido el interceptor JWT a los providers

### 7. Rutas de la Aplicación
- **Archivo**: `src/app/app.routes.ts`
- **Modificación**: Añadida ruta de login y guard de autenticación

## Cómo usar:

### 1. Login del usuario:
```typescript
// En tu componente
this.authService.login({ email: 'user@example.com', password: 'password' })
  .subscribe({
    next: () => {
      // Usuario logueado exitosamente
      this.router.navigate(['/dashboard']);
    },
    error: (error) => {
      // Manejar error de login
    }
  });
```

### 2. Verificar estado de autenticación:
```typescript
// En cualquier componente
export class MyComponent {
  authService = inject(AuthService);
  
  // Reactivo con signals
  isLoggedIn = this.authService.isAuthenticated();
  currentUser = this.authService.currentUser();
}
```

### 3. Logout:
```typescript
this.authService.logout(); // Redirige automáticamente a login
```

### 4. Proteger rutas:
```typescript
// En app.routes.ts
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard] // Requiere autenticación
}
```

### 5. Hacer peticiones HTTP protegidas:
```typescript
// Todas las peticiones HTTP automáticamente incluyen el token JWT
this.http.get('/api/protected-endpoint').subscribe(data => {
  // El token se envía automáticamente
});
```

## Estructura del token esperado:

El backend debe retornar una respuesta como:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Usuario"
  }
}
```

## Headers enviados automáticamente:

Todas las peticiones HTTP (excepto login/register) incluirán:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Próximos pasos:

1. **Configurar tu endpoint de login** en el backend para que retorne el formato esperado
2. **Ajustar la URL del API** en `src/environments/environment.ts` si es necesario
3. **Integrar el componente de login** en tu aplicación
4. **Añadir el componente user-menu** en tu header/sidebar
5. **Aplicar el guard** a las rutas que requieren autenticación

## Configuración del backend necesaria:

Tu endpoint de login debe:
1. Validar credenciales
2. Generar un JWT token
3. Retornar el token y datos del usuario
4. Todos los demás endpoints deben validar el token JWT en el header Authorization