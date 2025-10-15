import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { CommonModule, registerLocaleData, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import localeEs from '@angular/common/locales/es';

import { MedidaService } from '../../../../core/services/medida-service';
import { IHitoGet, IMaxMedidaGet, IMedidaGet } from '../../../../core/interfaces/hito';
import { ShowMedida } from '../../../../components/show-medida/show-medida';
import { HitoService } from '../../../../core/services/hito-service';

@Component({
  selector: 'app-medida',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    ShowMedida,
    FloatLabelModule
  ],
  templateUrl: './medida.html',
  styleUrls: ['./medida.css']
})
export class Medida implements OnInit {
  medidas: IMedidaGet[] = [];
  loading: boolean = false;
  selectedMedida: IMedidaGet | null = null;
  showDialog: boolean = false;
  hitos: IHitoGet[] = [];
  selectedHitos: IHitoGet | null = null;
  maxMedida: IMaxMedidaGet | null = null;
  datePipe = new DatePipe('es');

  constructor(
    private medidaService: MedidaService,
    private hitoService: HitoService
  ) {
    registerLocaleData(localeEs);
  }

  ngOnInit() {
    this.hitoService.getAllHitos().subscribe((hitos: IHitoGet[]) => {
      this.hitos = hitos;
    });
  }

  clear(table: Table) {
    table.clear();
  }

  onRowClick(medida: IMedidaGet) {
    this.selectedMedida = medida;
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.selectedMedida = null;
  }

  onMedidaUpdated() {
    if (this.selectedHitos && this.selectedHitos.hitoId) {
      this.loading = true;
      this.medidaService.getMedidasById(this.selectedHitos.hitoId).subscribe({
        next: (data: IMedidaGet[]) => {
          this.medidas = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        }
      });

      this.medidaService.getMaxMedidaById(this.selectedHitos.hitoId).subscribe({
        next: (maxMedida) => {
          this.maxMedida = maxMedida;
        },
        error: (err) => {
          console.error('Error fetching maxMedida:', err);
        }
      });
    }
    this.closeDialog();
  }

  onHitoChange(event: any) {
    const selectedHito = event.value;
    if (selectedHito && selectedHito.hitoId) {
      this.loading = true;
      this.medidaService.getMedidasById(selectedHito.hitoId).subscribe({
        next: (data: IMedidaGet[]) => {
          this.medidas = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        }
      });

      this.medidaService.getMaxMedidaById(selectedHito.hitoId).subscribe({
        next: (maxMedida) => {
          this.maxMedida = maxMedida;
        },
        error: (err) => {
          console.error('Error fetching maxMedida:', err);
        }
      });
    }
  }

  applyDateFilter(event: any, table: Table) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (!searchValue) {
      // Si no hay valor de búsqueda, mostrar todos los datos
      table.filteredValue = null;
      return;
    }

    // Filtrar manualmente los datos
    const filteredData = this.medidas.filter(medida => {
      const formattedDate = this.datePipe.transform(medida.fechaMedicion, 'dd/MMM/yyyy', '', 'es');
      const dateString = formattedDate?.toLowerCase() || '';
      return dateString.includes(searchValue);
    });

    // Aplicar el filtro a la tabla
    table.filteredValue = filteredData;
    table.totalRecords = filteredData.length;
  }
}
