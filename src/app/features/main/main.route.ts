import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Dashboard } from './dashboard/dashboard';
import { DepositoRelave } from './deposito-relave/deposito-relave';
import { Desplazamiento } from './dashboard/desplazamiento/desplazamiento';
import { Trayectoria } from './dashboard/trayectoria/trayectoria';
import { Velocidad } from './dashboard/velocidad/velocidad';
import { Medida } from './hito-topografico/medida/medida';
import { Hito } from './hito-topografico/hito/hito';
import { Register } from './hito-topografico/register';
import { PiezometroCasagrande } from './piezometro-casagrande/piezometro-casagrande';
import { Piezometro } from './piezometro-casagrande/piezometro/piezometro';
import { Lecturas } from './piezometro-casagrande/lecturas/lecturas';

export const MAIN_ROUTES: Routes = [
    {
        path: 'inicio',
        component: Inicio
    },
    {
        path: 'deposito-relave',
        component: DepositoRelave
    },
    {
        path: 'hito-topograficos',
        component: Register,
        children: [
            { path: '', redirectTo: 'hito', pathMatch: 'full' },
            { path: 'hito', component: Hito },
            { path: 'lecturas', component: Medida },
        ]
    },
    {
        path: 'piezometro',
        component: PiezometroCasagrande,
        children: [
            { path: '', redirectTo: 'piezometro', pathMatch: 'full' },
            { path: 'piezometro', component: Piezometro },
            { path: 'lecturas', component: Lecturas },
        ]
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
    { path: '**', redirectTo: 'inicio' }
];
