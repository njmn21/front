import { Routes } from '@angular/router';
import { Inicio } from './components/main/inicio/inicio';
import { Dashboard } from './components/main/dashboard/dashboard';
import { Register } from './components/main/register/register';

import { Hito } from './components/main/register/hito/hito';
import { Deposito } from './components/main/register/deposito/deposito';
import { DepositoRelave } from './components/main/deposito-relave/deposito-relave';
// Importa los componentes si existen
// import { HitosTopograficos } from './components/main/register/hitos-topograficos/hitos-topograficos';
// import { Medidas } from './components/main/register/medidas/medidas';

export const routes: Routes = [
    { path: 'inicio', component: Inicio },
    { path: 'dashboard', component: Dashboard },
    { path: 'deposito-relave', component: DepositoRelave },
    {
        path: 'registrar',
        component: Register,
        children: [
            { path: '', redirectTo: 'deposito', pathMatch: 'full' },
            { path: 'deposito', component: Deposito },
            // Descomenta y ajusta si tienes estos componentes:
            { path: 'hito', component: Hito },
            // { path: 'medidas', component: Medidas },
        ]
    },
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
];
