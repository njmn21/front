import { Injectable } from '@angular/core';
import { IMedidaGet } from '../interfaces/deposito';

@Injectable({
    providedIn: 'root'
})
export class ChartDataService {
    getFallbackData(): any {
        return {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
            datasets: [
                {
                    label: 'Desplazamiento Horizontal Absoluto (cm)',
                    data: [0.12, 0.19, 0.03, 0.05, 0.02, 0.03, 0.07],
                    fill: false,
                    borderColor: '#42A5F5',
                    backgroundColor: 'rgba(66, 165, 245, 0.1)',
                    tension: 0,
                    pointBackgroundColor: '#42A5F5',
                    pointBorderColor: '#42A5F5',
                    pointRadius: 4
                }
            ]
        };
    }

    processChartData(medidas: IMedidaGet[], key: keyof IMedidaGet, colores: string[]): any {
        const medidasOrdenadas = medidas.sort((a, b) =>
            new Date(a.fechaMedicion).getTime() - new Date(b.fechaMedicion).getTime()
        );

        const medidasPorHito = medidasOrdenadas.reduce((acc, medida) => {
            if (!acc[medida.nombreHito]) {
                acc[medida.nombreHito] = [];
            }
            acc[medida.nombreHito].push(medida);
            return acc;
        }, {} as { [key: string]: IMedidaGet[] });

        const fechasUnicas = [...new Set(medidasOrdenadas.map(medida => {
            const fecha = new Date(medida.fechaMedicion);
            fecha.setDate(fecha.getDate() + 1);
            return fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }))];

        return {
            labels: fechasUnicas,
            datasets: Object.keys(medidasPorHito).map((nombreHito, index) => {
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
            })
        };
    }
}