import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { generateChartOptions } from '../chart-options';
import { ChartModule } from 'primeng/chart';
import { Subscription, Subject } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { takeUntil } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';

import { IHitoGet } from '../../../../core/interfaces/deposito';
import { MedidaService } from '../../../../core/services/medida-service';
import { IMedidaGet } from '../../../../core/interfaces/deposito';
import { DataProcessingService } from '../../../../core/services/data-processing.service';
import { HitoSharedService } from '../../../../core/services/hito-shared.service';
import { chartConfig } from '../../../../core/config/chart-config';

Chart.register({
  id: 'backgroundZonesAverageSpeed',
  beforeDraw: (chart: any) => {
    if (chart.config.options.plugins.backgroundZonesVelocityEnabled) {
      const ctx = chart.ctx;
      const yScale = chart.scales.y;
      const zones = [
        { from: 0, to: 1.2, color: 'rgba(0, 255, 0, 0.2)' },
        { from: 1.2, to: 5.3, color: 'rgba(255, 255, 0, 0.2)' },
        { from: 5.3, to: 6, color: 'rgba(255, 165, 0, 0.2)' }
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

        ctx.save();
        ctx.fillStyle = color;
        ctx.font = '12px Arial';
        ctx.fillText(label, chart.chartArea.right - 140, lineY - 5);
        ctx.restore();
      };

      drawHorizontalLine(1.2, 'green', 'N. Alerta 1: 1.2 cm/día');
      drawHorizontalLine(5.3, 'orange', 'N. Alerta 2: 5.3 cm/día');
    }
  }
})

@Component({
  selector: 'app-velocidad',
  imports: [
    FormsModule,
    MultiSelectModule,
    ChartModule,
    ButtonModule,
    CommonModule
  ],
  templateUrl: './velocidad.html',
  styleUrl: './velocidad.css'
})
export class Velocidad implements OnInit, OnDestroy {

  hitos: IHitoGet[] = [];
  selectedHitos: IHitoGet[] = [];
  private subscription: Subscription = new Subscription();
  private destroy$ = new Subject<void>();

  dataAverageSpeed: any;
  optionsAverageSpeed: any;
  loading: boolean = true;
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
        this.initChart();
        this.loading = false;
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
          console.warn('No se encontraron medidas para los hitos seleccionados');
          this.initChart();
        }
        this.loading = false;
        this.showClearButton = true;
      },
      error: (error) => {
        console.error('Error al obtener medidas:', error);
        this.loading = false;
        this.initChart();
        this.showClearButton = true;
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

    this.downloadChart('chartAverageSpeed', `Velocidad_Media_${selectedHitosNames}_${timestamp}`);
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

    this.dataAverageSpeed = {
      labels: fechasUnicas,
      datasets: this.createDataset(medidasPorHito, fechasUnicas, 'velocidadMedia', chartConfig.colors)
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
    this.optionsAverageSpeed = generateChartOptions(chartConfig.baseOptions, 'Velocidad Media', 'Velocidad Media (cm/día)', 6);
    this.optionsAverageSpeed.scales.y.min = 0;
    this.optionsAverageSpeed.scales.y.ticks.stepSize = 1;
    this.optionsAverageSpeed.plugins.legend = { position: 'right' };

    this.optionsAverageSpeed.plugins.backgroundZonesVelocityEnabled = true;

    this.cd.markForCheck();
  }
}
