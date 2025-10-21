import { Component, ViewChild } from '@angular/core';
import { TableModule, Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import {
  ConfirmationService,
  MessageService
} from 'primeng/api';
import { Toast } from "primeng/toast";

import { HitoService } from '../../../../core/services/hito-service';
import { FormHito } from '../../../../components/form-hito/form-hito';
import { FormMedida } from '../../../../components/form-medida/form-medida';
import { IHitoGetWithCoordinates } from '../../../../core/interfaces/hito';
import { ShowHito } from '../../../../components/show-hito/show-hito';

@Component({
  selector: 'app-hito',
  imports: [
    TableModule,
    CommonModule,
    Toast,
    FormHito,
    FormMedida,
    ShowHito
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
  templateUrl: './hito.html',
  styleUrl: './hito.css'
})
export class Hito {
  @ViewChild('dt') dt!: Table;

  hitos: any[] = [];
  initialValue: any[] = [];
  loading: boolean = true;
  isSorted: boolean | null = null;
  selectedHito: IHitoGetWithCoordinates | null = null;
  showDialog: boolean = false;

  constructor(
    private messageService: MessageService,
    private hitoService: HitoService
  ) { }

  ngOnInit() {
    this.cargarHitos();
  }

  cargarHitos() {
    this.loading = true;
    this.hitoService.getAllHitosWithCoordinates().subscribe({
      next: (data) => {
        this.hitos = data;
        this.initialValue = [...data];
        this.loading = false;
      },
      error: () => {
        this.hitos = [];
        this.initialValue = [];
        this.loading = false;
      }
    });
  }

  mostrarToast(mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Hito Creado',
      detail: mensaje,
      life: 3000
    });

    this.cargarHitos();
  }

  customSort(event: any) {
    if (this.isSorted == null || this.isSorted === undefined) {
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted == true) {
      this.isSorted = false;
      this.sortTableData(event);
    } else if (this.isSorted == false) {
      this.isSorted = null;
      this.hitos = [...this.initialValue];
      this.dt.reset();
    }
  }

  sortTableData(event: any) {
    event.data.sort((data1: any, data2: any) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  formatNumericValue(value: number | null | undefined): string {
    if (value === null || value === undefined || value === 0) {
      return '-';
    }
    return (value as number).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  onRowClick(hito: IHitoGetWithCoordinates) {
    this.selectedHito = hito;
    this.showDialog = true;
  }
}
