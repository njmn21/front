import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';

import { MedidaService } from '../../../../core/services/medida-service';
import { IHitoGet, IMaxMedidaGet, IMedidaGet } from '../../../../core/interfaces/deposito';
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
  loading: boolean = true;
  selectedMedida: IMedidaGet | null = null;
  showDialog: boolean = false;
  hitos: IHitoGet[] = [];
  selectedHitos: IHitoGet | null = null;
  maxMedida: IMaxMedidaGet | null = null;

  constructor(
    private medidaService: MedidaService,
    private hitoService: HitoService
  ) { }

  ngOnInit() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 3000);

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
}
