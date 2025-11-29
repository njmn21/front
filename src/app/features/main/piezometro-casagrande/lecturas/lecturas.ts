import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es';

import { ShowMedidaPiezometro } from '../../../../components/show-medida-piezometro/show-medida-piezometro';
import { IPiezometroGet, IMeasurementPiezometroGet } from '../../../../core/interfaces/piezometro';
import { PiezometroService } from '../../../../core/services/piezometro-service';

// Registrar el locale español
registerLocaleData(localeEs);

@Component({
  selector: 'app-lecturas',
  imports: [
    CommonModule,
    SelectModule,
    TableModule,
    InputTextModule,
    FormsModule,
    ShowMedidaPiezometro
  ],
  templateUrl: './lecturas.html',
  styleUrl: './lecturas.css'
})
export class Lecturas implements OnInit {

  piezometros: IPiezometroGet[] = [];
  selectedPiezometro: IPiezometroGet | null = null;
  selectedMedida: IMeasurementPiezometroGet | null = null;
  showDialog: boolean = false;
  medidas: IMeasurementPiezometroGet[] = [];
  loading: boolean = false;
  datePipe = new DatePipe('es');

  constructor(
    private piezometroService: PiezometroService
  ) { }

  ngOnInit() {
    this.loadPiezometros();
  }

  private loadPiezometros() {
    this.loading = true;
    this.piezometroService.getAllPiezometros().subscribe({
      next: (piezometros: IPiezometroGet[]) => {
        this.piezometros = piezometros;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading piezometros:', error);
        this.loading = false;
      }
    });
  }

  onPiezometroChange(event: any) {
    const selectedPiezometro = event.value;
    if (selectedPiezometro) {
      this.loadMedidas(selectedPiezometro.piezometroId);
    } else {
      this.medidas = [];
    }
  }

  private loadMedidas(piezometroId: number) {
    this.loading = true;
    this.piezometroService.getMeasurementsByPiezomettroId(piezometroId).subscribe({
      next: (medidas: IMeasurementPiezometroGet[]) => {
        this.medidas = medidas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading medidas:', error);
        this.loading = false;
      }
    });
  }

  applyDateFilter(event: any, table: any) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (!searchValue) {
      table.filteredValue = null;
      return;
    }

    const filteredData = this.medidas.filter(medida => {
      const formattedDate = this.datePipe.transform(medida.fechaMedicion, 'dd/MMM/yyyy', '', 'es');
      const dateString = formattedDate?.toLowerCase() || '';
      return dateString.includes(searchValue);
    });

    table.filteredValue = filteredData;
    table.totalRecords = filteredData.length;
  }

  onRowClick(medida: IMeasurementPiezometroGet) {
    this.selectedMedida = medida;
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.selectedMedida = null;
  }

  onMedidaUpdated() {
    if (this.selectedPiezometro) {
      this.loadMedidas(this.selectedPiezometro.piezometroId);
    }
  }
}
