import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { RouterOutlet } from '@angular/router';
import { UserMenu } from '../../../components/shared/user-menu/user-menu';

@Component({
  selector: 'app-register',
  imports: [
    RouterOutlet,
    UserMenu,
    Menubar
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Hitos Topográficos',
        icon: 'pi pi-list-check',
        routerLink: ['hito']
      },
      {
        label: 'Lecturas',
        icon: 'pi pi-list-check',
        routerLink: ['lecturas']
      },
      {
        label: 'Graficos',
        icon: 'pi pi-chart-line',
        routerLink: ['graficos']
      }
    ]
  }
}
