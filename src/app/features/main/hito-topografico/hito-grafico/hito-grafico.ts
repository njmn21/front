import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { RouterOutlet } from '@angular/router';

import { HitoService } from '../../../../core/services/hito-service';
import { HitoSharedService } from '../../../../core/services/hito-shared.service';
import { IHitoGet } from '../../../../core/interfaces/hito';

@Component({
  selector: 'app-hito-grafico',
  imports: [
    Menu,
    RouterOutlet
  ],
  templateUrl: './hito-grafico.html',
  styleUrl: './hito-grafico.css'
})
export class HitoGrafico implements OnInit {
  items: MenuItem[] | undefined;

  constructor(
    private hitoService: HitoService,
    private hitoSharedService: HitoSharedService
  ) { }

  ngOnInit() {
    this.hitoService.getAllHitos().subscribe((hitos: IHitoGet[]) => {
      this.hitoSharedService.setHitos(hitos);
    });

    this.items = [
      {
        label: 'Desplazamiento',
        icon: 'pi pi-chart-line',
        routerLink: ['desplazamiento']
      },
      {
        label: 'Velocidad',
        icon: 'pi pi-chart-line',
        routerLink: ['velocidad']
      },
      {
        label: 'Trayectoria',
        icon: 'pi pi-chart-line',
        routerLink: ['trayectoria']
      }
    ];
  }
}
