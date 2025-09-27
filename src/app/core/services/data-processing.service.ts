import { Injectable } from '@angular/core';
import { IMedidaGet } from '../interfaces/deposito';

@Injectable({
    providedIn: 'root'
})
export class DataProcessingService {
    processMedidas(medidas: IMedidaGet[]): {
        medidasOrdenadas: IMedidaGet[];
        medidasPorHito: { [key: string]: IMedidaGet[] };
        fechasUnicas: string[];
    } {
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
        }, {} as { [key: string]: IMedidaGet[] });

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

        return { medidasOrdenadas, medidasPorHito, fechasUnicas };
    }
}