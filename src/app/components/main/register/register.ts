import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [Menubar, RouterOutlet],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Deposito Relaves',
        icon: 'pi pi-list',
        routerLink: ['deposito']
      },
      {
        label: 'Hitos Topograficos',
        icon: 'pi pi-list',
        routerLink: ['hito']
      },
      {
        label: 'Medidas',
        icon: 'pi pi-list'
      }
    ]
  }
}
