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
import { MedidaService } from '../../../../core/services/medida-service';
import { IHitoGet, IMedidaGet } from '../../../../core/interfaces/deposito';
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
    ShowMedida
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

  constructor(
    private medidaService: MedidaService,
    private hitoService: HitoService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.hitoService.getAllHitos().subscribe((hitos: IHitoGet[]) => {
      this.hitos = hitos;
    });
    this.medidaService.getAllMedidas().subscribe({
      next: (data: IMedidaGet[]) => {
        this.medidas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando medidas:', err);
        this.loading = false;
      }
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
    }
  }
}
