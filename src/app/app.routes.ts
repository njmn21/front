import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./auth/login/login')
                .then(m => m.Login)
    },
    {
        path: '',
        loadChildren: () =>
            import('./features/main/main.route')
                .then(m =>
                    m.MAIN_ROUTES
                ),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];
