import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { DepositoRelave } from './deposito-relave/deposito-relave';
import { Desplazamiento } from './hito-topografico/hito-grafico/desplazamiento/desplazamiento';
import { Trayectoria } from './hito-topografico/hito-grafico/trayectoria/trayectoria';
import { Velocidad } from './hito-topografico/hito-grafico/velocidad/velocidad';
import { Medida } from './hito-topografico/medida/medida';
import { Hito } from './hito-topografico/hito/hito';
import { Register } from './hito-topografico/register';
import { PiezometroCasagrande } from './piezometro-casagrande/piezometro-casagrande';
import { Piezometro } from './piezometro-casagrande/piezometro/piezometro';
import { Lecturas } from './piezometro-casagrande/lecturas/lecturas';
import { HitoGrafico } from './hito-topografico/hito-grafico/hito-grafico';
import { PiezometroGrafico } from './piezometro-casagrande/piezometro-grafico/piezometro-grafico';
import { PiezometroDs } from './piezometro-casagrande/piezometro-grafico/piezometro-ds/piezometro-ds';

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
            {
                path: 'graficos', component: HitoGrafico,
                children: [
                    { path: '', redirectTo: 'desplazamiento', pathMatch: 'full' },
                    { path: 'desplazamiento', component: Desplazamiento },
                    { path: 'velocidad', component: Velocidad },
                    { path: 'trayectoria', component: Trayectoria }
                ]
            },
        ]
    },
    {
        path: 'piezometro',
        component: PiezometroCasagrande,
        children: [
            { path: '', redirectTo: 'piezometro', pathMatch: 'full' },
            { path: 'piezometro', component: Piezometro },
            { path: 'lecturas', component: Lecturas },
            {
                path: 'graficos', component: PiezometroGrafico,
                children: [
                    { path: '', redirectTo: 'historico', pathMatch: 'full' },
                    { path: 'historico', component: PiezometroDs }
                ]
            }
        ]
    },
    { path: '**', redirectTo: 'inicio' }
];
