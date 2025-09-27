import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-left-sidebar',
  imports: [CommonModule, RouterModule, DrawerModule, ButtonModule, Ripple, AvatarModule, StyleClass],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.css'
})
export class LeftSidebar {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  visible: boolean = true;

  items = [
    {
      routeLink: '/inicio',
      icon: 'pi pi-fw pi-home',
      label: 'Inicio'
    },
    {
      routeLink: '/dashboard',
      icon: 'pi pi-fw pi-chart-bar',
      label: 'Dashboard'
    },
    {
      routeLink: '/deposito-relave',
      icon: 'pi pi-fw pi-box',
      label: 'Depósito Relaves'
    },
    {
      routeLink: '/registrar',
      icon: 'pi pi-pen-to-square',
      label: 'Hitos y Lecturas'
    }
  ]

  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }

  toggleDarkerMode() {
    const element = document.querySelector('html');
    if (element) {
      element.classList.toggle('my-app-dark');
    }
  }
}
