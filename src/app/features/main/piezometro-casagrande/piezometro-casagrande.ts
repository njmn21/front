import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-piezometro-casagrande',
  imports: [
    RouterOutlet,
    Menubar
  ],
  templateUrl: './piezometro-casagrande.html',
  styleUrl: './piezometro-casagrande.css'
})
export class PiezometroCasagrande implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Piezómetros',
        icon: 'pi pi-list-check',
        routerLink: ['piezometro']
      },
      {
        label: 'Lecturas',
        icon: 'pi pi-list-check',
        routerLink: ['lecturas']
      }
    ]
  }
}
