import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { Chart } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';

import { IHitoGet } from '../../../../core/interfaces/hito';
import { MedidaService } from '../../../../core/services/medida-service';
import { IMedidaGet } from '../../../../core/interfaces/hito';
import { DataProcessingService } from '../../../../core/services/data-processing.service';
import { HitoSharedService } from '../../../../core/services/hito-shared.service';
import { chartOptions, generateChartOptions } from '../chart-options';
import { chartConfig } from '../../../../core/config/chart-config';

Chart.register({
  id: 'backgroundZonesTotal',
  beforeDraw: (chart: any) => {
    if (chart.config.options.plugins.backgroundZonesDesplazamientoEnabled) {
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

      const drawHorizontalLine = (yValue: number, color: string, label: string) => {
        const lineY = yScale.getPixelForValue(yValue);
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(chart.chartArea.left, lineY);
        ctx.lineTo(chart.chartArea.right, lineY);
        ctx.stroke();
        ctx.restore();

        // etiqueta para la linea
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = '12px Arial';
        ctx.fillText(label, chart.chartArea.right - 140, lineY - 5);
        ctx.restore();
      };

      // dibujar las lineas usando la funcion helper
      drawHorizontalLine(5, 'green', 'N. Alerta 1: 5 cm');
      drawHorizontalLine(15, 'orange', 'N. Alerta 2: 15 cm');
      drawHorizontalLine(25, 'red', 'N. Alerta 3: 25 cm');
    }
  }
});

@Component({
  selector: 'app-desplazamiento',
  imports: [
    FormsModule,
    MultiSelectModule,
    ChartModule,
    CommonModule,
    ButtonModule
  ],
  templateUrl: './desplazamiento.html',
  styleUrl: './desplazamiento.css'
})
export class Desplazamiento implements OnInit, OnDestroy {

  hitos: IHitoGet[] = [];
  selectedHitos: IHitoGet[] = [];
  private destroy$ = new Subject<void>();

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
  loading: boolean = false;
  showClearButton: boolean = false;


  constructor(
    private medidaService: MedidaService,
    private dataProcessingService: DataProcessingService,
    private hitoSharedService: HitoSharedService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.hitoSharedService.hitos$
      .pipe(takeUntil(this.destroy$))
      .subscribe(hitos => {
        this.hitos = hitos;
        // inicializar con datos de ejemplo pero sin cargar datos reales
        this.initChart();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateCharts() {
    if (!this.selectedHitos || this.selectedHitos.length === 0) {
      return;
    }

    this.loading = true;
    const hitoIds = this.selectedHitos.map(hito => hito.hitoId);

    this.medidaService.getMedidasByIds(hitoIds).subscribe({
      next: (medidas: IMedidaGet[]) => {
        if (medidas && medidas.length > 0) {
          this.processDataForChart(medidas);
        } else {
          // mostrar mensaje o datos vacios si no hay datos
          console.warn('No se encontraron medidas para los hitos seleccionados');
          this.initChart();
        }
        this.loading = false;
        this.showClearButton = true; // boton limpiar despues de graficar
      },
      error: (error) => {
        console.error('Error al cargar medidas por hitos seleccionados:', error);
        let errorMessage = 'Error al cargar los datos de los gráficos.';

        if (error.status === 400) {
          errorMessage = 'Algunos de los hitos seleccionados podrían no tener medidas disponibles.';
        }

        console.warn(errorMessage);
        this.loading = false;
        this.showClearButton = true;
        this.initChart();
      }
    });
  }

  clearCharts() {
    this.selectedHitos = [];
    this.showClearButton = false;
    this.initChart();
  }

  downloadCharts() {
    const selectedHitosNames = this.selectedHitos.map(hito => hito.nombreHito).join('_');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

    // grafico horizontal
    this.downloadChart('chartHorizontal', `Desplazamiento_Horizontal_${selectedHitosNames}_${timestamp}`);

    // grafico vertical
    setTimeout(() => {
      this.downloadChart('chartVertical', `Desplazamiento_Vertical_${selectedHitosNames}_${timestamp}`);
    }, 100);

    // grafico total
    setTimeout(() => {
      this.downloadChart('chartTotal', `Desplazamiento_Total_${selectedHitosNames}_${timestamp}`);
    }, 200);
  }

  private downloadChart(chartId: string, filename: string) {
    const chartElement = document.getElementById(chartId);
    if (chartElement) {
      const canvas = chartElement.querySelector('canvas');
      if (canvas) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        if (tempCtx) {
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;

          tempCtx.fillStyle = '#ffffff';
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

          tempCtx.drawImage(canvas, 0, 0);

          const link = document.createElement('a');
          link.download = `${filename}.png`;
          link.href = tempCanvas.toDataURL('image/png');
          link.click();
        }
      }
    }
  }

  loadMedidasData() {
    this.loading = true;
  }

  processDataForChart(medidas: IMedidaGet[]) {
    const { medidasPorHito, fechasUnicas } = this.dataProcessingService.processMedidas(medidas);

    this.data = {
      labels: fechasUnicas,
      datasets: this.createDataset(medidasPorHito, fechasUnicas, 'horizontalAbsoluto', chartConfig.colors)
    };

    this.dataVertical = {
      labels: fechasUnicas,
      datasets: this.createDataset(medidasPorHito, fechasUnicas, 'verticalAbsoluto', chartConfig.colors)
    };

    this.dataTotal = {
      labels: fechasUnicas,
      datasets: this.createDataset(medidasPorHito, fechasUnicas, 'totalAbsoluto', chartConfig.colors)
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
    this.options = generateChartOptions(chartConfig.baseOptions, chartOptions.horizontal.title, chartOptions.horizontal.yAxisTitle, 30);
    this.options.plugins.legend = { position: 'right' };

    this.optionsVertical = generateChartOptions(chartConfig.baseOptions, chartOptions.vertical.title, chartOptions.vertical.yAxisTitle, 30);
    this.optionsVertical.scales.y.min = -5;
    this.optionsVertical.plugins.legend = { position: 'right' };

    this.optionsTotal = {
      ...generateChartOptions(chartConfig.baseOptions, chartOptions.total.title.join(' '), chartOptions.total.yAxisTitle, chartOptions.total.max),
      plugins: {
        backgroundZonesDesplazamientoEnabled: true,
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
