export const chartConfig = {
    colors: [
        '#42A5F5', '#66BB6A', '#FF7043', '#AB47BC', '#26A69A',
        '#FFA726', '#EF5350', '#5C6BC0', '#FFCA28', '#78909C'
    ],
    baseOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Eje X'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Eje Y'
                }
            }
        }
    },
    backgroundZones: [
        { from: 0, to: 5, color: 'rgba(0, 255, 0, 0.2)' },
        { from: 5, to: 15, color: 'rgba(255, 255, 0, 0.2)' },
        { from: 15, to: 25, color: 'rgba(255, 165, 0, 0.2)' },
        { from: 25, to: 30, color: 'rgba(255, 0, 0, 0.2)' }
    ]
};