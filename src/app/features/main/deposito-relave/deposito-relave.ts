import { Component } from '@angular/core';
import {
  ConfirmationService,
  MessageService
} from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

import { Deposito } from '../../../core/services/deposito';
import { IDepositoGet } from '../../../core/interfaces/deposito';
import { FormDeposito } from '../../../components/form-deposito/form-deposito';
import { ShowDeposito } from '../../../components/show-deposito/show-deposito';
import { UserMenu } from '../../../components/shared/user-menu/user-menu';

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
    ShowDeposito,
    UserMenu
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
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
    { field: 'zonaUtm', header: 'Zona UTM' },
    { field: 'coordenadaEste', header: 'Coordenada Este' },
    { field: 'coordenadaNorte', header: 'Coordenada Norte' },
    { field: 'fechaCreacion', header: 'Fecha de Creación' },
  ];

  //IDeposito[]
  ejemplo: any[] = [
    { id: 1, nombreDeposito: 'Ejemplo 1', ubicacion: 'Ubicación 1', fechaCreacion: '2025-09-14', capacidad: 1000, estado: 'Activo' },
    { id: 2, nombreDeposito: 'Ejemplo 2', ubicacion: 'Ubicación 2', fechaCreacion: '2025-09-15', capacidad: 2000, estado: 'Inactivo' },
    { id: 3, nombreDeposito: 'Ejemplo 3', ubicacion: 'Ubicación 3', fechaCreacion: '2025-09-16', capacidad: 3000, estado: 'Activo' }
  ];

  constructor(
    private depositoService: Deposito,
    private messageService: MessageService
  ) {
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

  mostrarToast(mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Depósito creado',
      detail: mensaje,
      life: 3000
    });
  }

  onRowClick(deposito: IDepositoGet) {
    this.depositoSeleccionado = deposito;
    this.showDepositoVisible = true;
  }

  onDepositoUpdated() {
    if (this.depositoSeleccionado && this.depositoSeleccionado.id) {
      this.loading = true;
      this.depositoService.getAllDepositos().subscribe({
        next: data => {
          this.depositos = data;
          this.loading = false;
          this.mostrarToast('Depósito actualizado exitosamente');
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error al recargar datos:', error);
          this.loading = false;
          this.closeDialog();
        }
      });
    } else {
      this.closeDialog();
    }
  }

  closeDialog() {
    this.showDepositoVisible = false;
    this.depositoSeleccionado = null;
  }
}
