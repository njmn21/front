import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';

import { MedidaService } from '../../../../core/services/medida-service';
import { DataProcessingService } from '../../../../core/services/data-processing.service';
import { HitoSharedService } from '../../../../core/services/hito-shared.service';
import { IHitoGet, IMedidaGet } from '../../../../core/interfaces/deposito';

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
  selectedHitos: IHitoGet | null = null;
  private subscription: Subscription = new Subscription();

  dataEsteNorte: any;
  optionsEsteNorte: any;
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
    const { medidasPorHito } = this.dataProcessingService.processMedidas(medidas);

    const colores = [
      '#42A5F5', '#66BB6A', '#FF7043', '#AB47BC', '#26A69A',
      '#FFA726', '#EF5350', '#5C6BC0', '#FFCA28', '#78909C'
    ];

    this.dataEsteNorte = Object.keys(medidasPorHito).map((nombreHito, index) => {
      const datosHito = medidasPorHito[nombreHito];
      const color = colores[index % colores.length];

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