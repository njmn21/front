import { Component, ViewChild } from '@angular/core';
import { TableModule, Table } from 'primeng/table';
import { CommonModule } from '@angular/common';

import { PiezometroService } from '../../../../core/services/piezometro-service';
import { IPiezometroGet } from '../../../../core/interfaces/piezometro';
import { ShowPiezometro } from '../../../../components/show-piezometro/show-piezometro';

@Component({
  selector: 'app-piezometro',
  imports: [
    TableModule,
    CommonModule,
    ShowPiezometro
  ],
  templateUrl: './piezometro.html',
  styleUrl: './piezometro.css'
})
export class Piezometro {
  @ViewChild('dt') dt!: Table;

  piezometros: IPiezometroGet[] = [];
  initialValue: any[] = [];
  loading: boolean = true;
  isSorted: boolean | null = null;
  selectedPiezometro: IPiezometroGet | null = null;
  showDialog: boolean = false;

  constructor(
    private piezometroService: PiezometroService
  ) { }

  ngOnInit() {
    this.cargarPiezometros();
  }

  cargarPiezometros() {
    this.loading = true;
    this.piezometroService.getAllPiezometros().subscribe({
      next: (data) => {
        this.piezometros = data;
        this.initialValue = [...data];
        this.loading = false;
      },
      error: () => {
        this.piezometros = [];
        this.initialValue = [];
        this.loading = false;
      }
    });
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
      this.piezometros = [...this.initialValue];
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

  onRowClick(piezometro: IPiezometroGet) {
    console.log('Row clicked:', piezometro);
    this.selectedPiezometro = piezometro;
    this.showDialog = true;
    console.log('showDialog set to:', this.showDialog);
  }
}
