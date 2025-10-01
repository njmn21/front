import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';

import { MedidaService } from '../../../../core/services/medida-service';
import { DataProcessingService } from '../../../../core/services/data-processing.service';
import { HitoSharedService } from '../../../../core/services/hito-shared.service';
import { IHitoGet, IMedidaGet } from '../../../../core/interfaces/deposito';
import { chartConfig } from '../../../../core/config/chart-config';

@Component({
  selector: 'app-trayectoria',
  imports: [
    FormsModule,
    MultiSelectModule,
    ChartModule,
    CommonModule,
    ButtonModule
  ],
  templateUrl: './trayectoria.html',
  styleUrl: './trayectoria.css'
})
export class Trayectoria implements OnInit, OnDestroy {

  hitos: IHitoGet[] = [];
  selectedHitos: IHitoGet[] = [];
  private destroy$ = new Subject<void>();

  dataEsteNorte: any;
  optionsEsteNorte: any;
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

    const chartElements = document.querySelectorAll('[id="chartEsteNorte"]');

    chartElements.forEach((chartElement, index) => {
      setTimeout(() => {
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

            const hitoName = this.dataEsteNorte[index]?.nombreHito || `Hito_${index + 1}`;
            const link = document.createElement('a');
            link.download = `Trayectoria_${hitoName}_${timestamp}.png`;
            link.href = tempCanvas.toDataURL('image/png');
            link.click();
          }
        }
      }, index * 100);
    });
  }

  loadMedidasData() {
    this.loading = true;
  }

  processDataForChart(medidas: IMedidaGet[]) {
    const { medidasPorHito } = this.dataProcessingService.processMedidas(medidas);

    this.dataEsteNorte = Object.keys(medidasPorHito).map((nombreHito, index) => {
      const datosHito = medidasPorHito[nombreHito];
      const color = chartConfig.colors[index % chartConfig.colors.length];

      return {
        nombreHito,
        data: {
          datasets: [
            {
              label: nombreHito,
              data: datosHito.map((medida) => ({
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
            },
            {
              label: 'Punto Inicial',
              data: [],
              backgroundColor: 'orange',
              borderColor: 'orange',
              pointBackgroundColor: 'orange',
              pointBorderColor: 'orange',
              pointRadius: 4,
              showLine: false
            },
            {
              label: 'Punto Final',
              data: [],
              backgroundColor: 'red',
              borderColor: 'red',
              pointBackgroundColor: 'red',
              pointBorderColor: 'red',
              pointRadius: 4,
              showLine: false
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'right'
            },
            title: {
              display: true,
              text: `Trayectoria del Hito: ${nombreHito}`,
              font: {
                size: 16
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Coordenadas Este (m)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Coordenadas Norte (m)'
              }
            }
          }
        }
      };
    });

    this.cd.markForCheck();
  }

  initChart() {
    // Datos de ejemplo como fallback
    this.dataEsteNorte = [{
      nombreHito: 'Ejemplo',
      data: {
        datasets: [
          {
            label: 'Ejemplo de Trayectoria',
            data: [
              { x: 0, y: 0 },
              { x: 1, y: 2 },
              { x: 2, y: 3 },
              { x: 3, y: 5 },
              { x: 4, y: 8 }
            ],
            fill: false,
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66, 165, 245, 0.1)',
            tension: 0,
            pointRadius: [4, 0, 0, 0, 4], // First and last points visible
            pointBackgroundColor: ['orange', '#42A5F5', '#42A5F5', '#42A5F5', 'red'],
            pointBorderColor: ['orange', '#42A5F5', '#42A5F5', '#42A5F5', 'red'],
            showLine: true
          },
          // Legend entries for initial and final points
          {
            label: 'Punto Inicial',
            data: [],
            backgroundColor: 'orange',
            borderColor: 'orange',
            pointBackgroundColor: 'orange',
            pointBorderColor: 'orange',
            pointRadius: 4,
            showLine: false
          },
          {
            label: 'Punto Final',
            data: [],
            backgroundColor: 'red',
            borderColor: 'red',
            pointBackgroundColor: 'red',
            pointBorderColor: 'red',
            pointRadius: 4,
            showLine: false
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'right'
          },
          title: {
            display: true,
            text: 'Ejemplo de Trayectoria',
            font: {
              size: 16
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Coordenadas Este (m)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Coordenadas Norte (m)'
            }
          }
        }
      }
    }];
    this.cd.markForCheck();
  }
}