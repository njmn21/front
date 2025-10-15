import { CommonModule } from '@angular/common';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { RouterOutlet } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { HitoService } from '../../../core/services/hito-service';
import { HitoSharedService } from '../../../core/services/hito-shared.service';
import { IHitoGet } from '../../../core/interfaces/hito';


@Component({
  selector: 'app-dashboard',
  imports: [
    ChartModule,
    CommonModule,
    Menubar,
    RouterOutlet,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
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
