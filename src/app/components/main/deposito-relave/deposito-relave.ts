import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Deposito } from '../../../services/deposito';
import { IDeposito } from '../../../core/interfaces/deposito';
import { ButtonModule } from 'primeng/button';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-deposito-relave',
  imports: [TableModule, CommonModule, ButtonModule],
  templateUrl: './deposito-relave.html',
  styleUrl: './deposito-relave.css'
})
export class DepositoRelave {
  depositos: IDeposito[] = [];
  loading: boolean = true;

  cols: Column[] = [
    { field: 'nombreDeposito', header: 'Nombre' },
    { field: 'ubicacion', header: 'Ubicación' },
    { field: 'fechaCreacion', header: 'Fecha de Creación' }
  ];

  constructor(private depositoService: Deposito) {

    this.depositoService.getAllDepositos().subscribe({
      next: data => {
        this.depositos = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

  }
}
