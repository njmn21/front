import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterOutlet, Menubar],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Hitos Topograficos',
        icon: 'pi pi-list-check',
        routerLink: ['hito']
      },
      {
        label: 'Lecturas',
        icon: 'pi pi-list-check',
        routerLink: ['lecturas']
      }
    ]
  }
}
