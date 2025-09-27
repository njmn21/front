// Crear un archivo separado para las opciones de gráficos
export const chartOptions = {
    baseOptions: {
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
            tooltip: {
                callbacks: {
                    label: function (context: { raw: number; dataset: { label: string } }) {
                        let value = context.raw;
                        if (typeof value === 'number') {
                            value = parseFloat(value.toFixed(2));
                        }
                        return `${context.dataset.label}: ${value}`;
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    },
    horizontal: {
        title: 'Desplazamientos Horizontales Absolutos',
        yAxisTitle: 'Desplazamiento Horizontal Absoluto (cm)',
        scales: {
            y: {
                min: 0,
                max: 30,
                ticks: {
                    stepSize: 5
                }
            }
        }
    },
    vertical: {
        title: 'Desplazamientos Verticales Absolutos',
        yAxisTitle: 'Desplazamiento Vertical Absoluto (cm)'
    },
    total: {
        title: ['Desplazamientos Totales Absolutos', 'Zonas: Verde (0-5), Amarillo (5-15), Naranja (15-25), Rosa (25-30)'],
        yAxisTitle: 'Desplazamiento Total Absoluto (cm)',
        max: 30
    },
    esteNorte: {
        xAxisTitle: 'Coordenadas Este (m)',
        yAxisTitle: 'Coordenadas Norte (m)'
    }
};

// Crear una función reutilizable para generar configuraciones de gráficos dinámicamente
export function generateChartOptions(baseOptions: any, title: string, yAxisTitle: string, max?: number): any {
    return {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            title: {
                display: true,
                text: title,
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
                    text: yAxisTitle,
                    color: '#000000'
                },
                ticks: {
                    color: '#000000',
                    stepSize: 5
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.2)',
                    drawBorder: false
                },
                min: 0,
                max: max
            }
        }
    };
}