import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./features/main/main.route')
                .then(m =>
                    m.MAIN_ROUTES
                )
    },
    {
        path: '**',
        redirectTo: 'inicio'
    }
];
