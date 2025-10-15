import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es';

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
    FormsModule
  ],
  templateUrl: './lecturas.html',
  styleUrl: './lecturas.css'
})
export class Lecturas implements OnInit {

  piezometros: IPiezometroGet[] = [];
  selectedPiezometro: IPiezometroGet | null = null;
  medidas: IMeasurementPiezometroGet[] = [];
  loading: boolean = false;

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
    const filterValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(filterValue, 'contains');
  }

  onRowClick(medida: IMeasurementPiezometroGet) {
    console.log('Medida seleccionada:');
    // Aquí puedes agregar la lógica que necesites cuando se haga clic en una fila
  }
}
