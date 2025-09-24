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
import { IMedidadGet } from '../../../../core/interfaces/deposito';

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
    SelectModule
  ],
  templateUrl: './medida.html',
  styleUrls: ['./medida.css']
})
export class Medida implements OnInit {
  medidas: IMedidadGet[] = [];

  loading: boolean = true;

  constructor(private medidaService: MedidaService) { }

  ngOnInit() {
    this.loading = true;
    this.medidaService.getAllMedidas().subscribe({
      next: (data: IMedidadGet[]) => {
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
}
