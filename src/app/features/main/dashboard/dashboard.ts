import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import html2canvas from 'html2canvas';
import { Chart } from 'chart.js';

import { MedidaService } from '../../../core/services/medida-service';
import { IMedidaGet } from '../../../core/interfaces/deposito';
import { chartOptions, generateChartOptions } from './chart-options';
import { DataProcessingService } from '../../../core/services/data-processing.service';


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
  selector: 'app-dashboard',
  imports: [ChartModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  data: any;
  options: any;
  dataVertical: any;
  optionsVertical: any;
  dataTotal: any;
  optionsTotal: any;
  dataEsteNorte: any;
  optionsEsteNorte: any;
  dataAverageSpeed: any;
  optionsAverageSpeed: any;
  loading: boolean = true;

  constructor(
    private cd: ChangeDetectorRef,
    private medidaService: MedidaService,
    private dataProcessingService: DataProcessingService
  ) { }

  ngOnInit() {
    this.loadMedidasData();
  }

  loadMedidasData() {
    this.loading = true;
    this.medidaService.getAllMedidas().subscribe({
      next: (medidas: IMedidaGet[]) => {
        this.processDataForChart(medidas);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar medidas para dashboard:', error);
        this.loading = false;
        // En caso de error, usar datos de ejemplo
        this.initChart();
      }
    });
  }

  // Extraer lógica repetitiva de creación de datasets en una función reutilizable
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

    this.dataEsteNorte = {
      datasets: Object.keys(medidasPorHito).map((nombreHito, index) => {
        const datosHito = medidasPorHito[nombreHito];
        const color = colores[index % colores.length];

        return {
          label: nombreHito,
          data: datosHito.map((medida, i) => ({
            x: medida.este,
            y: medida.norte
          })),
          fill: false,
          borderColor: color,
          backgroundColor: color + '20',
          tension: 0,
          pointRadius: datosHito.map((_, i) => (i === 0 || i === datosHito.length - 1 ? 4 : 0)),
          pointBackgroundColor: datosHito.map((_, i) => (i === 0 ? 'orange' : i === datosHito.length - 1 ? 'red' : color)),
          pointBorderColor: datosHito.map((_, i) => (i === 0 ? 'orange' : i === datosHito.length - 1 ? 'red' : color)),
          showLine: true,
        };
      })
    };

    // New chart for average speed
    this.dataAverageSpeed = {
      labels: fechasUnicas,
      datasets: this.createDataset(medidasPorHito, fechasUnicas, 'velocidadMedia', colores)
    };

    this.initChartOptions();
    this.cd.markForCheck();
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
    this.optionsVertical = generateChartOptions(baseOptions, chartOptions.vertical.title, chartOptions.vertical.yAxisTitle, 30);
    this.optionsVertical.scales.y.min = -5;
    this.optionsTotal = {
      ...generateChartOptions(baseOptions, chartOptions.total.title.join(' '), chartOptions.total.yAxisTitle, chartOptions.total.max),
      plugins: {
        backgroundZonesEnabled: true
      }
    };
    this.optionsEsteNorte = {
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: chartOptions.esteNorte.xAxisTitle
          }
        },
        y: {
          title: {
            display: true,
            text: chartOptions.esteNorte.yAxisTitle
          }
        }
      }
    };

    // Options for average speed chart
    this.optionsAverageSpeed = generateChartOptions(baseOptions, 'Velocidad Media', 'Velocidad Media (m/s)', 6);
    this.optionsAverageSpeed.scales.y.min = 0;
    this.optionsAverageSpeed.scales.y.ticks.stepSize = 1;

    this.cd.markForCheck();
  }

  // Refactorizar método descargarGraficos
  private captureChart(chartElement: HTMLElement, id: string): void {
    html2canvas(chartElement, { useCORS: true, willReadFrequently: true } as any)
      .then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = `${id}.jpg`;
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
      })
      .catch((error: any) => {
        console.error(`Error al capturar el gráfico ${id}:`, error);
      });
  }

  descargarGraficos() {
    const ids = ['chartHorizontal', 'chartVertical', 'chartTotal', 'chartEsteNorte'];

    ids.forEach((id) => {
      const chartElement = document.getElementById(id);
      if (!chartElement) {
        console.error(`No se encontró el elemento del gráfico: ${id}`);
        return;
      }

      try {
        this.captureChart(chartElement, id);
      } catch (error) {
        console.error(`Error inesperado al procesar el gráfico ${id}:`, error);
      }
    });
  }
}
