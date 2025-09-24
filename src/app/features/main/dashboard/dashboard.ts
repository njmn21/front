import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import html2canvas from 'html2canvas';

import { MedidaService } from '../../../core/services/medida-service';
import { IMedidadGet } from '../../../core/interfaces/deposito';

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
  loading: boolean = true;

  constructor(private cd: ChangeDetectorRef, private medidaService: MedidaService) { }

  ngOnInit() {
    this.loadMedidasData();
  }

  loadMedidasData() {
    this.loading = true;
    this.medidaService.getAllMedidas().subscribe({
      next: (medidas: IMedidadGet[]) => {
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

  processDataForChart(medidas: IMedidadGet[]) {
    // Ordenar medidas por fecha
    const medidasOrdenadas = medidas.sort((a, b) =>
      new Date(a.fechaMedicion).getTime() - new Date(b.fechaMedicion).getTime()
    );

    // Agrupar medidas por nombreHito
    const medidasPorHito = medidasOrdenadas.reduce((acc, medida) => {
      if (!acc[medida.nombreHito]) {
        acc[medida.nombreHito] = [];
      }
      acc[medida.nombreHito].push(medida);
      return acc;
    }, {} as { [key: string]: IMedidadGet[] });

    // Obtener todas las fechas únicas ordenadas
    const fechasUnicas = [...new Set(medidasOrdenadas.map(medida => {
      const fecha = new Date(medida.fechaMedicion);
      fecha.setDate(fecha.getDate() + 1);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }))];

    // Colores para diferentes hitos
    const colores = [
      '#42A5F5', '#66BB6A', '#FF7043', '#AB47BC', '#26A69A',
      '#FFA726', '#EF5350', '#5C6BC0', '#FFCA28', '#78909C'
    ];

    // Crear datasets para cada hito - Horizontal Absoluto
    const datasetsHorizontal = Object.keys(medidasPorHito).map((nombreHito, index) => {
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
        return medida ? medida.horizontalAbsoluto : null;
      });

      return {
        label: nombreHito,
        data: data,
        fill: false,
        borderColor: color,
        backgroundColor: color + '20',
        tension: 0, //cambiar la forma de la linea 0.4
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointRadius: 6,
        spanGaps: false
      };
    });

    // Crear datasets para cada hito - Vertical Absoluto
    const datasetsVertical = Object.keys(medidasPorHito).map((nombreHito, index) => {
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
        return medida ? medida.verticalAbsoluto : null;
      });

      return {
        label: nombreHito,
        data: data,
        fill: false,
        borderColor: color,
        backgroundColor: color + '20',
        tension: 0, //cambiar la forma de la linea 0.4
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointRadius: 6,
        spanGaps: false
      };
    });

    // Crear datasets para cada hito - Total Absoluto
    const datasetsTotal = Object.keys(medidasPorHito).map((nombreHito, index) => {
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
        return medida ? medida.totalAbsoluto : null;
      });

      return {
        label: nombreHito,
        data: data,
        fill: false,
        borderColor: color,
        backgroundColor: color + '20',
        tension: 0, //cambiar la forma de la linea 0.4
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointRadius: 6,
        spanGaps: false
      };
    });

    // Primer gráfico - Horizontal Absoluto
    this.data = {
      labels: fechasUnicas,
      datasets: datasetsHorizontal
    };

    // Segundo gráfico - Vertical Absoluto
    this.dataVertical = {
      labels: fechasUnicas,
      datasets: datasetsVertical
    };

    // Tercer gráfico - Total Absoluto
    this.dataTotal = {
      labels: fechasUnicas,
      datasets: datasetsTotal
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
          label: 'Horizontal Absoluto',
          data: [0.12, 0.19, 0.03, 0.05, 0.02, 0.03, 0.07],
          fill: false,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.1)',
          tension: 0, //cambiar la forma de la linea 0.4
          pointBackgroundColor: '#42A5F5',
          pointBorderColor: '#42A5F5',
          pointRadius: 6
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
          pointRadius: 6
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
          pointRadius: 6
        }
      ]
    };
    this.initChartOptions();
  }

  initChartOptions() {
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#000000',
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        title: {
          display: true,
          text: 'Desplazamientos Horizontales Absolutos',
          color: '#000000',
          font: {
            size: 16
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Fecha de Medición',
            color: '#000000'
          },
          ticks: {
            color: '#000000'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.2)',
            drawBorder: false
          }
        },
        y: {
          title: {
            display: true,
            text: 'Horizontal Absoluto',
            color: '#000000'
          },
          ticks: {
            color: '#000000'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.2)',
            drawBorder: false
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    };

    this.optionsVertical = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#000000',
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        title: {
          display: true,
          text: 'Desplazamientos Verticales Absolutos',
          color: '#000000',
          font: {
            size: 16
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Fecha de Medición',
            color: '#000000'
          },
          ticks: {
            color: '#000000'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.2)',
            drawBorder: false
          }
        },
        y: {
          title: {
            display: true,
            text: 'Vertical Absoluto',
            color: '#000000'
          },
          ticks: {
            color: '#000000'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.2)',
            drawBorder: false
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    };

    this.optionsTotal = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#000000',
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        title: {
          display: true,
          text: ['Desplazamientos Totales Absolutos', 'Zonas: Verde (0-5), Amarillo (5-15), Naranja (15-25), Rosa (25-30)'],
          color: '#000000',
          font: {
            size: 16
          },
          padding: {
            top: 10,
            bottom: 10
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Fecha de Medición',
            color: '#000000'
          },
          ticks: {
            color: '#000000'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.2)',
            drawBorder: false
          }
        },
        y: {
          title: {
            display: true,
            text: 'Total Absoluto',
            color: '#000000'
          },
          ticks: {
            color: '#000000'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.2)',
            drawBorder: false
          },
          max: 30
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      animation: {
        onComplete: function (animation: any) {
          const chart = animation.chart;
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;

          if (chartArea && chart.scales.y) {
            const yAxis = chart.scales.y;

            // Definir las zonas con valores fijos basados en la imagen de referencia
            const zones = [
              { start: 30, end: 25, color: 'rgba(255, 182, 193, 0.6)' }, // Rosa - valores altos (25-30)
              { start: 25, end: 15, color: 'rgba(255, 218, 185, 0.6)' }, // Naranja - valores medios-altos (15-25)
              { start: 15, end: 5, color: 'rgba(255, 255, 224, 0.6)' }, // Amarillo - valores medios (5-15)
              { start: 5, end: 0, color: 'rgba(175, 238, 238, 0.6)' } // Verde claro - valores bajos (0-5)
            ];

            // Dibujar las zonas de fondo
            zones.forEach(zone => {
              const startY = yAxis.getPixelForValue(zone.start);
              const endY = yAxis.getPixelForValue(zone.end);

              // Solo dibujar si los valores están dentro del rango visible del gráfico
              if (zone.start >= yAxis.min && zone.end <= yAxis.max) {
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = zone.color;
                ctx.fillRect(chartArea.left, startY, chartArea.right - chartArea.left, endY - startY);
                ctx.restore();
              }
            });
          }
        }
      }
    };
    this.cd.markForCheck();
  }

  descargarGraficos() {
    const ids = ['chartHorizontal', 'chartVertical', 'chartTotal'];

    ids.forEach((id) => {
      const chartElement = document.getElementById(id);
      if (!chartElement) {
        console.error(`No se encontró el elemento del gráfico: ${id}`);
        return;
      }

      try {
        // Usar html2canvas para capturar el contenedor completo del gráfico
        html2canvas(chartElement, { useCORS: true, willReadFrequently: true } as any).then((canvas: HTMLCanvasElement) => {
          const link = document.createElement('a');
          link.download = `${id}.jpg`;
          link.href = canvas.toDataURL('image/jpeg');
          link.click();
        }).catch((error: any) => {
          console.error(`Error al capturar el gráfico ${id}:`, error);
        });
      } catch (error) {
        console.error(`Error inesperado al procesar el gráfico ${id}:`, error);
      }
    });
  }
}
