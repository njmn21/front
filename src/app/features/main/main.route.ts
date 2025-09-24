import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Dashboard } from './dashboard/dashboard';
import { Register } from './register/register';
import { Hito } from './register/hito/hito';
import { DepositoRelave } from './deposito-relave/deposito-relave';
import { Medida } from './register/medida/medida';

export const MAIN_ROUTES: Routes = [
    {
        path: 'inicio',
        component: Inicio
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'deposito-relave',
        component: DepositoRelave
    },
    {
        path: 'registrar',
        component: Register,
        children: [
            { path: '', redirectTo: 'hito', pathMatch: 'full' },
            { path: 'hito', component: Hito },
            { path: 'medida', component: Medida },
        ]
    },
    { path: '**', redirectTo: 'inicio' }
];
