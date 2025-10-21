import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-piezometro-grafico',
  imports: [
    Menu,
    RouterOutlet
  ],
  templateUrl: './piezometro-grafico.html',
  styleUrl: './piezometro-grafico.css'
})
export class PiezometroGrafico implements OnInit {
  items: MenuItem[] | undefined;

  constructor() { }

  ngOnInit() {
    this.items = [
      {
        label: 'Histórico de Piezómetros',
        icon: 'pi pi-chart-line',
        routerLink: ['historico']
      },
    ]
  }
}
