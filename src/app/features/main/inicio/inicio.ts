import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-inicio',
  imports: [DrawerModule, ButtonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  visible1: boolean = false;

  visible2: boolean = false;

  visible3: boolean = false;

  visible4: boolean = false;
}
