import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-dashboard',
  imports: [ChartModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  data: any;

  options: any;

  platformId = inject(PLATFORM_ID);

  // Servicios eliminados, se usarán datos de ejemplo

  constructor(private cd: ChangeDetectorRef) { }

  // Efecto de tema eliminado, no es necesario para datos de ejemplo

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    // Usar datos y opciones de ejemplo simples
    this.data = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
      datasets: [
        {
          label: 'Ventas',
          data: [12, 19, 3, 5, 2, 3, 7],
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4
        },
        {
          label: 'Compras',
          data: [8, 11, 7, 6, 5, 4, 6],
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4
        }
      ]
    };
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#fff'
          },
          grid: {
            color: '#fff',
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: '#fff'
          },
          grid: {
            color: '#fff',
            drawBorder: false
          }
        }
      }
    };
    this.cd.markForCheck();
  }
}
