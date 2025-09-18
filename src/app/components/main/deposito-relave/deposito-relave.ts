import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Deposito } from '../../../services/deposito';
import { IDepositoGet } from '../../../core/interfaces/deposito';
import { FormDeposito } from '../../form-deposito/form-deposito';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

import { ShowDeposito } from '../../show-deposito/show-deposito';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-deposito-relave',
  imports: [
    TableModule,
    CommonModule,
    FormDeposito,
    ToastModule,
    ButtonModule,
    ShowDeposito
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './deposito-relave.html',
  styleUrl: './deposito-relave.css'
})
export class DepositoRelave {
  showDepositoVisible: boolean = false;
  depositoSeleccionado: IDepositoGet | null = null;
  depositos: IDepositoGet[] = [];
  loading: boolean = true;

  cols: Column[] = [
    { field: 'nombreDeposito', header: 'Nombre' },
    { field: 'ubicacion', header: 'Ubicación' },
    { field: 'capacidad', header: 'Capacidad (m³)' },
    { field: 'fechaCreacion', header: 'Fecha de Creación' },
    { field: 'estado', header: 'Estado' },
  ];

  //IDeposito[]
  ejemplo: any[] = [
    { id: 1, nombreDeposito: 'Ejemplo 1', ubicacion: 'Ubicación 1', fechaCreacion: '2025-09-14', capacidad: 1000, estado: 'Activo' },
    { id: 2, nombreDeposito: 'Ejemplo 2', ubicacion: 'Ubicación 2', fechaCreacion: '2025-09-15', capacidad: 2000, estado: 'Inactivo' },
    { id: 3, nombreDeposito: 'Ejemplo 3', ubicacion: 'Ubicación 3', fechaCreacion: '2025-09-16', capacidad: 3000, estado: 'Activo' }
  ];

  constructor(private depositoService: Deposito) {
    this.cargarDepositos();
  }

  cargarDepositos() {
    this.loading = true;
    this.depositoService.getAllDepositos().subscribe({
      next: data => {
        this.depositos = data;
        this.loading = false;
      },
      error: () => {
        this.depositos = this.ejemplo;
        this.loading = false;
      }
    });
  }

  abrirShowDeposito(deposito: IDepositoGet) {
    this.depositoSeleccionado = deposito;
    this.showDepositoVisible = true;
  }
}
