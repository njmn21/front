import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Dashboard } from './dashboard/dashboard';
import { Register } from './register/register';
import { Hito } from './register/hito/hito';
import { DepositoRelave } from './deposito-relave/deposito-relave';
import { Medida } from './register/medida/medida';
import { Desplazamiento } from './dashboard/desplazamiento/desplazamiento';
import { Trayectoria } from './dashboard/trayectoria/trayectoria';
import { Velocidad } from './dashboard/velocidad/velocidad';

export const MAIN_ROUTES: Routes = [
    {
        path: 'inicio',
        component: Inicio
    },
    {
        path: 'dashboard',
        component: Dashboard,
        children: [
            { path: '', redirectTo: 'desplazamiento', pathMatch: 'full' },
            { path: 'desplazamiento', component: Desplazamiento },
            { path: 'trayectoria', component: Trayectoria },
            { path: 'velocidad', component: Velocidad },
        ]
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
            { path: 'lecturas', component: Medida },
        ]
    },
    { path: '**', redirectTo: 'inicio' }
];
