import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { ChangeDetectorRef } from '@angular/core';
import { Chart } from 'chart.js';

import { IPiezometroGet, IMeasurementPiezometroGet } from '../../../../../core/interfaces/piezometro';
import { PiezometroService } from '../../../../../core/services/piezometro-service';
import { chartConfig } from '../../../../../core/config/chart-config';

Chart.register({
  id: 'backgroundZonesPiezometro',
  beforeDraw: (chart: any) => {
    if (chart.config.options.plugins.backgroundZonesPiezometroEnabled) {
      const ctx = chart.ctx;
      const yScale = chart.scales.y;

      // Obtener el rango actual del gráfico
      const yMin = yScale.min;
      const yMax = yScale.max;
      const yRange = yMax - yMin;

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

      // Dibujar líneas de alerta con valores específicos para el rango completo
      drawHorizontalLine(256, 'green', ' ');
      drawHorizontalLine(257, 'orange', ' ');
      drawHorizontalLine(260, 'red', ' ');

      // Dibujar línea de cota fondo del pozo si está disponible
      if (chart.config.options.plugins.cotaFondoPozo) {
        drawHorizontalLine(chart.config.options.plugins.cotaFondoPozo, 'blue', `Cota Fondo del Pozo: ${chart.config.options.plugins.cotaFondoPozo} m`);
      }

      // Dibujar línea de cota actual del terreno si está disponible
      if (chart.config.options.plugins.cotaActualTerreno) {
        drawHorizontalLine(chart.config.options.plugins.cotaActualTerreno, 'brown', `Cota Actual del Terreno: ${chart.config.options.plugins.cotaActualTerreno} m`);
      }
    }
  }
});

@Component({
  selector: 'app-piezometro-ds',
  imports: [
    FormsModule,
    MultiSelectModule,
    ChartModule,
    CommonModule,
    ButtonModule,
    DatePickerModule
  ],
  templateUrl: './piezometro-ds.html',
  styleUrl: './piezometro-ds.css'
})
export class PiezometroDs implements OnInit {

  showClearButton: boolean = false;
  piezometro: IPiezometroGet[] = [];
  selectedPiezometro: IPiezometroGet[] = [];
  dataEsteNorte: any;

  // Filtros de fecha
  startDate: Date | null = null;
  endDate: Date | null = null;
  showDateFilters: boolean = false;

  // Datos originales sin filtrar
  originalMedidas: IMeasurementPiezometroGet[] = [];
  originalDataEsteNorte: any;

  constructor(
    private cd: ChangeDetectorRef,
    private piezometroService: PiezometroService
  ) { }

  ngOnInit() {
    this.getAllPiezometros();
    this.initChart();
  }

  clearCharts() {
    this.selectedPiezometro = [];
    this.showClearButton = false;
    this.showDateFilters = false;
    this.startDate = null;
    this.endDate = null;
    this.originalMedidas = [];
    this.originalDataEsteNorte = null;
    this.initChart();
  }

  initChart() {
    // Datos de ejemplo como fallback para gráfico temporal
    const now = new Date();
    const exampleLabels = [
      new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
      new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
      new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
      new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
      now.toLocaleDateString('es-ES')
    ];
    const exampleData = [10.5, 10.8, 11.2, 10.9, 11.5];

    this.dataEsteNorte = [{
      nombreHito: 'Ejemplo Piezómetro',
      data: {
        labels: exampleLabels,
        datasets: [
          {
            label: 'Evolución Piezométrica',
            data: exampleData,
            fill: false,
            borderColor: '#42A5F5',
            borderWidth: 2,
            backgroundColor: 'rgba(66, 165, 245, 0.1)',
            tension: 0,
            pointRadius: 4,
            pointBackgroundColor: '#42A5F5',
            pointBorderColor: '#42A5F5',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right'
          },
          title: {
            display: true,
            text: 'Evolución Piezométrica',
            font: {
              size: 16
            }
          },
          backgroundZonesPiezometroEnabled: false
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha de Medición'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Elevación (msnm)'
            },
            min: 200,
            max: 265,
            ticks: {
              stepSize: 5
            }
          }
        }
      }
    }];
    this.cd.markForCheck();
  }

  generateCharts() {
    if (!this.selectedPiezometro || this.selectedPiezometro.length === 0) {
      return;
    }

    const piezometroIds = this.selectedPiezometro.map(piezometro => piezometro.piezometroId);
    console.log('Piezómetros seleccionados:', this.selectedPiezometro);
    console.log('IDs de piezómetros a enviar:', piezometroIds);

    this.piezometroService.getMedidasByPiezometroIds(piezometroIds).subscribe({
      next: (medidas) => {
        console.log('Medidas recibidas:', medidas);
        if (medidas && medidas.length > 0) {
          // Guardar datos originales
          this.originalMedidas = medidas;
          this.processDataForChart(medidas);
          this.showDateFilters = true;
        } else {
          console.warn('No se encontraron medidas para los piezómetros seleccionados');
          this.initChart();
          this.showDateFilters = false;
        }
        this.showClearButton = true;
      },
      error: (error) => {
        console.error('Error al obtener medidas:', error);
        this.initChart();
        this.showClearButton = true;
        this.showDateFilters = false;
      }
    });
  }

  processDataForChart(medidas: IMeasurementPiezometroGet[]) {
    // Agrupar medidas por piezómetro
    const medidasPorPiezometro: { [key: string]: IMeasurementPiezometroGet[] } = {};

    medidas.forEach(medida => {
      const piezometro = this.selectedPiezometro.find(p => p.piezometroId === medida.piezometroId);
      const nombrePiezometro = piezometro?.nombrePiezometro || `Piezómetro ${medida.piezometroId}`;

      if (!medidasPorPiezometro[nombrePiezometro]) {
        medidasPorPiezometro[nombrePiezometro] = [];
      }
      medidasPorPiezometro[nombrePiezometro].push(medida);
    });

    // Ordenar medidas por fecha para cada piezómetro
    Object.keys(medidasPorPiezometro).forEach(nombre => {
      medidasPorPiezometro[nombre].sort((a, b) =>
        new Date(a.fechaMedicion).getTime() - new Date(b.fechaMedicion).getTime()
      );
    });

    this.dataEsteNorte = this.createChartData(medidasPorPiezometro);

    // Guardar datos originales para el filtro
    if (!this.originalDataEsteNorte) {
      this.originalDataEsteNorte = [...this.dataEsteNorte];
    }

    this.cd.markForCheck();
  }

  private createChartData(medidasPorPiezometro: { [key: string]: IMeasurementPiezometroGet[] }) {
    return Object.keys(medidasPorPiezometro).map((nombrePiezometro, index) => {
      const datosPiezometro = medidasPorPiezometro[nombrePiezometro];
      const color = chartConfig.colors[index % chartConfig.colors.length];

      // Formatear fechas para las etiquetas
      const labels = datosPiezometro.map(medida => {
        const fecha = new Date(medida.fechaMedicion);
        return fecha.toLocaleDateString('es-ES');
      });

      const data = datosPiezometro.map(medida => medida.cotaNivelPiezometro);

      return {
        nombreHito: nombrePiezometro,
        data: {
          labels: labels,
          datasets: [
            {
              label: nombrePiezometro,
              data: data,
              fill: false,
              borderColor: color,
              borderWidth: 2,
              backgroundColor: color + '20',
              tension: 0,
              pointRadius: 4,
              pointBackgroundColor: color,
              pointBorderColor: color,
            },
            {
              label: 'Cota Fonda del Piezómetro (msnm)',
              data: [],
              backgroundColor: 'blue',
              borderColor: 'blue',
              pointBackgroundColor: 'blue',
              pointBorderColor: 'blue',
              pointRadius: 4,
              showLine: false
            },
            {
              label: 'Cota del Terreno (msnm)',
              data: [],
              backgroundColor: 'brown',
              borderColor: 'brown',
              pointBackgroundColor: 'brown',
              pointBorderColor: 'brown',
              pointRadius: 4,
              showLine: false
            },
            {
              label: 'Nivel de Alerta 1 (msnm)',
              data: [],
              backgroundColor: 'green',
              borderColor: 'green',
              pointBackgroundColor: 'green',
              pointBorderColor: 'green',
              pointRadius: 4,
              showLine: false
            },
            {
              label: 'Nivel de Alerta 2 (msnm)',
              data: [],
              backgroundColor: 'orange',
              borderColor: 'orange',
              pointBackgroundColor: 'orange',
              pointBorderColor: 'orange',
              pointRadius: 4,
              showLine: false
            },
            {
              label: 'Nivel de Alerta 3 (msnm)',
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
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'right'
            },
            title: {
              display: true,
              text: `Registro histórico del piezómetro tubo abierto: ${nombrePiezometro}`,
              font: {
                size: 16
              }
            },
            backgroundZonesPiezometroEnabled: true,
            cotaFondoPozo: datosPiezometro.length > 0 ? datosPiezometro[0].cotaFondoPozo : null,
            cotaActualTerreno: datosPiezometro.length > 0 ? datosPiezometro[0].cotaActualTerreno : null
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Fecha de Medición'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Cota Nivel Piezómetro (m)'
              },
              min: 200,
              max: 265,
              ticks: {
                stepSize: 5
              }
            }
          }
        }
      };
    });
  }

  // Métodos para filtros de fecha
  applyDateFilter() {
    if (!this.originalMedidas.length) return;

    let filteredMedidas = this.originalMedidas;

    // Aplicar filtro de fecha si están definidas
    if (this.startDate || this.endDate) {
      filteredMedidas = this.originalMedidas.filter(medida => {
        const fechaMedida = new Date(medida.fechaMedicion);

        let isAfterStart = true;
        let isBeforeEnd = true;

        if (this.startDate) {
          isAfterStart = fechaMedida >= this.startDate;
        }

        if (this.endDate) {
          // Agregar un día al endDate para incluir toda la fecha final
          const endDatePlusOne = new Date(this.endDate);
          endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
          isBeforeEnd = fechaMedida < endDatePlusOne;
        }

        return isAfterStart && isBeforeEnd;
      });
    }

    // Reprocesar los datos con las medidas filtradas
    this.processDataForChart(filteredMedidas);
  }

  clearDateFilter() {
    this.startDate = null;
    this.endDate = null;
    // Restaurar datos originales
    this.processDataForChart(this.originalMedidas);
  }

  onStartDateChange() {
    this.applyDateFilter();
  }

  onEndDateChange() {
    this.applyDateFilter();
  }

  onPiezometroChange() {
    this.showClearButton = this.selectedPiezometro.length > 0;
  }

  downloadCharts() {
    const selectedPiezometrosNames = this.selectedPiezometro.map(piezometro => piezometro.nombrePiezometro).join('_');
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

            const piezometroName = this.dataEsteNorte[index]?.nombreHito || `Piezometro_${index + 1}`;
            const link = document.createElement('a');
            link.download = `Piezometro_${piezometroName}_${timestamp}.png`;
            link.href = tempCanvas.toDataURL('image/png');
            link.click();
          }
        }
      }, index * 100);
    });
  }

  private getAllPiezometros() {
    this.piezometroService.getAllPiezometros().subscribe({
      next: (data) => {
        this.piezometro = data;
        this.cd.markForCheck();
      },
      error: () => {
        this.piezometro = [];
        this.cd.markForCheck();
      }
    });
  }
}
