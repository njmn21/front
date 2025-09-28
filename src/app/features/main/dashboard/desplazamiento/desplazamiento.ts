import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { Chart } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { HitoService } from '../../../../core/services/hito-service';
import { IHitoGet } from '../../../../core/interfaces/deposito';
import { MedidaService } from '../../../../core/services/medida-service';
import { IMedidaGet } from '../../../../core/interfaces/deposito';
import { DataProcessingService } from '../../../../core/services/data-processing.service';
import { HitoSharedService } from '../../../../core/services/hito-shared.service';
import { chartOptions, generateChartOptions } from '../chart-options';

Chart.register({
  id: 'backgroundZonesTotal',
  beforeDraw: (chart: any) => {
    if (chart.config.options.plugins.backgroundZonesEnabled) {
      const ctx = chart.ctx;
      const yScale = chart.scales.y;
      const zones = [
        { from: 0, to: 5, color: 'rgba(0, 255, 0, 0.2)' },
        { from: 5, to: 15, color: 'rgba(255, 255, 0, 0.2)' },
        { from: 15, to: 25, color: 'rgba(255, 165, 0, 0.2)' },
        { from: 25, to: 30, color: 'rgba(255, 0, 0, 0.2)' }
      ];

      zones.forEach(zone => {
        const yStart = yScale.getPixelForValue(zone.from);
        const yEnd = yScale.getPixelForValue(zone.to);

        ctx.fillStyle = zone.color;
        ctx.fillRect(
          chart.chartArea.left,
          yEnd,
          chart.chartArea.right - chart.chartArea.left,
          yStart - yEnd
        );
      });
    }
  }
});

@Component({
  selector: 'app-desplazamiento',
  imports: [
    FormsModule,
    MultiSelectModule,
    ChartModule,
    CommonModule
  ],
  templateUrl: './desplazamiento.html',
  styleUrl: './desplazamiento.css'
})
export class Desplazamiento implements OnInit, OnDestroy {

  hitos: IHitoGet[] = [];
  selectedHitos: IHitoGet | null = null;
  private subscription: Subscription = new Subscription();

  data: any;
  options: any;
  dataVertical: any;
  optionsVertical: any;
  dataTotal: any;
  optionsTotal: any;
  dataEsteNorte: any;
  dataAverageSpeed: any;
  optionsEsteNorte: any;
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

    this.data = {
      labels: fechasUnicas,
      datasets: this.createDataset(medidasPorHito, fechasUnicas, 'horizontalAbsoluto', colores)
    };

    this.dataVertical = {
      labels: fechasUnicas,
      datasets: this.createDataset(medidasPorHito, fechasUnicas, 'verticalAbsoluto', colores)
    };

    this.dataTotal = {
      labels: fechasUnicas,
      datasets: this.createDataset(medidasPorHito, fechasUnicas, 'totalAbsoluto', colores)
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
    this.data = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
      datasets: [
        {
          label: 'Desplazamiento Horizontal Absoluto (cm)',
          data: [0.12, 0.19, 0.03, 0.05, 0.02, 0.03, 0.07],
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

    this.dataVertical = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
      datasets: [
        {
          label: 'Vertical Absoluto',
          data: [0.08, 0.15, 0.02, 0.04, 0.01, 0.02, 0.05],
          fill: false,
          borderColor: '#66BB6A',
          backgroundColor: 'rgba(102, 187, 106, 0.1)',
          tension: 0, //cambiar la forma de la linea 0.4
          pointBackgroundColor: '#66BB6A',
          pointBorderColor: '#66BB6A',
          pointRadius: 4
        }
      ]
    };

    this.dataTotal = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
      datasets: [
        {
          label: 'Total Absoluto',
          data: [0.14, 0.24, 0.04, 0.07, 0.02, 0.04, 0.09],
          fill: false,
          borderColor: '#FF7043',
          backgroundColor: 'rgba(255, 112, 67, 0.1)',
          tension: 0, //cambiar la forma de la linea 0.4
          pointBackgroundColor: '#FF7043',
          pointBorderColor: '#FF7043',
          pointRadius: 4
        }
      ]
    };
    this.initChartOptions();
  }

  initChartOptions() {
    const baseOptions = chartOptions.baseOptions;

    this.options = generateChartOptions(baseOptions, chartOptions.horizontal.title, chartOptions.horizontal.yAxisTitle, 30);
    this.options.plugins.legend = { position: 'right' };

    this.optionsVertical = generateChartOptions(baseOptions, chartOptions.vertical.title, chartOptions.vertical.yAxisTitle, 30);
    this.optionsVertical.scales.y.min = -5;
    this.optionsVertical.plugins.legend = { position: 'right' };

    this.optionsTotal = {
      ...generateChartOptions(baseOptions, chartOptions.total.title.join(' '), chartOptions.total.yAxisTitle, chartOptions.total.max),
      plugins: {
        backgroundZonesEnabled: true,
        title: {
          display: true,
          text: 'Desplazamiento Total Absoluto (cm)',
          font: {
            size: 16
          }
        },
        legend: { position: 'right' }
      }
    };

    this.cd.markForCheck();
  }
}
