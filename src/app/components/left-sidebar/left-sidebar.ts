import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { Drawer } from 'primeng/drawer';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-left-sidebar',
  imports: [CommonModule, RouterModule, DrawerModule, ButtonModule, Ripple, AvatarModule, StyleClass, ToggleSwitchModule, FormsModule],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LeftSidebar {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  visible: boolean = true;
  checked: boolean = false; // Added property for toggle switch
  selectedItem: string = ''; // Added property to track selected item

  items = [
    {
      routeLink: '/inicio',
      icon: 'pi pi-fw pi-home',
      label: 'Inicio'
    },
    {
      routeLink: '/deposito-relave',
      icon: 'pi pi-fw pi-box',
      label: 'Depósito Relaves'
    },
    {
      routeLink: '/hito-topograficos',
      icon: 'pi pi-fw pi-pen-to-square',
      label: 'Hitos y Lecturas'
    },
    {
      routeLink: '/piezometro',
      icon: 'pi pi-fw pi-hammer',
      label: 'Piezómetros'
    },
    {
      routeLink: '/dashboard',
      icon: 'pi pi-fw pi-chart-bar',
      label: 'Gráficos'
    },
  ];

  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }

  toggleDarkerMode() {
    const element = document.querySelector('html');
    if (element) {
      element.classList.toggle('my-app-dark');
    }
  }

  onItemSelect(routeLink: string): void {
    this.selectedItem = routeLink; // Update selected item
  }
}
