import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { chartOptions, generateChartOptions } from '../chart-options';
import { Chart } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { Subscription } from 'rxjs';

import { HitoService } from '../../../../core/services/hito-service';
import { IHitoGet } from '../../../../core/interfaces/deposito';
import { MedidaService } from '../../../../core/services/medida-service';
import { IMedidaGet } from '../../../../core/interfaces/deposito';
import { DataProcessingService } from '../../../../core/services/data-processing.service';
import { HitoSharedService } from '../../../../core/services/hito-shared.service';

@Component({
  selector: 'app-velocidad',
  imports: [
    FormsModule,
    MultiSelectModule,
    ChartModule
  ],
  templateUrl: './velocidad.html',
  styleUrl: './velocidad.css'
})
export class Velocidad implements OnInit, OnDestroy {

  hitos: IHitoGet[] = [];
  selectedHitos: IHitoGet | null = null;
  private subscription: Subscription = new Subscription();

  dataAverageSpeed: any;
  optionsAverageSpeed: any;
  loading: boolean = true;

  constructor(
    private medidaService: MedidaService,
    private dataProcessingService: DataProcessingService,
    private hitoSharedService: HitoSharedService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.hitoSharedService.hitos$.subscribe(hitos => {
        this.hitos = hitos;
        this.loadMedidasData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadMedidasData() {
    this.loading = true;
    this.medidaService.getAllMedidas().subscribe({
      next: (medidas: IMedidaGet[]) => {
        this.processDataForChart(medidas);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.initChart();
      }
    });
  }

  processDataForChart(medidas: IMedidaGet[]) {
    const { medidasPorHito, fechasUnicas } = this.dataProcessingService.processMedidas(medidas);

    const colores = [
      '#42A5F5', '#66BB6A', '#FF7043', '#AB47BC', '#26A69A',
      '#FFA726', '#EF5350', '#5C6BC0', '#FFCA28', '#78909C'
    ];

    this.dataAverageSpeed = {
      labels: fechasUnicas,
      datasets: this.createDataset(medidasPorHito, fechasUnicas, 'velocidadMedia', colores)
    };

    this.initChartOptions();
    this.cd.markForCheck();
  }

  private createDataset(
    medidasPorHito: { [key: string]: IMedidaGet[] },
    fechasUnicas: string[],
    key: keyof IMedidaGet,
    colores: string[]): any[] {
    return Object.keys(medidasPorHito).map((nombreHito, index) => {
      const datosHito = medidasPorHito[nombreHito];
      const color = colores[index % colores.length];

      const data = fechasUnicas.map(fecha => {
        const medida = datosHito.find(m => {
          const fechaMedida = new Date(m.fechaMedicion);
          fechaMedida.setDate(fechaMedida.getDate() + 1);
          return fechaMedida.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) === fecha;
        });
        return medida ? medida[key] : null;
      });

      return {
        label: nombreHito,
        data: data,
        fill: false,
        borderColor: color,
        backgroundColor: color + '20',
        tension: 0,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointRadius: 4,
        spanGaps: false
      };
    });
  }

  initChart() {
    // Datos de ejemplo como fallback
    this.dataAverageSpeed = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
      datasets: [
        {
          label: 'Velocidad Media (cm/día)',
          data: [0.5, 0.8, 0.3, 0.6, 0.4, 0.7, 0.9],
          fill: false,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.1)',
          tension: 0, //cambiar la forma de la linea 0.4
          pointBackgroundColor: '#42A5F5',
          pointBorderColor: '#42A5F5',
          pointRadius: 4
        }
      ]
    };
    this.initChartOptions();
  }

  initChartOptions() {
    const baseOptions = chartOptions.baseOptions;

    this.optionsAverageSpeed = generateChartOptions(baseOptions, 'Velocidad Media', 'Velocidad Media (cm/día)', 6);
    this.optionsAverageSpeed.scales.y.min = 0;
    this.optionsAverageSpeed.scales.y.ticks.stepSize = 1;
    this.optionsAverageSpeed.plugins.legend = { position: 'right' };

    this.cd.markForCheck();
  }
}
