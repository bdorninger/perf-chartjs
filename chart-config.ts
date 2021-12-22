import { ChartConfiguration, ChartEvent, Point } from 'chart.js/auto';
import colorLib from '@kurkle/color';

export function getChartConfig(data: Point[]): ChartConfiguration {
  return {
    type: 'line',
    data: {
      // labels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
      datasets: [
        {
          label: '  Temperature',
          data: data,
          borderWidth: 2,
          borderColor: '#ff0016',
          backgroundColor: '#00ffee',
          hidden: false,
          fill: false,
          radius: 0,
          tension: 0,
          animation: false
        },
      ],
    },
    options: {
      scales: {
        y: {
          //offset: true,
          min: 0,
          max: 20,
          bounds: 'data',
          //suggestedMin: 0,
          //suggestedMax: 20,
          ticks: {
            stepSize: 2,
          },
        },
        x: {
          /*position: {
          y: 4,
        },*/
          //offset: true,
          type: 'linear',
          title: {
            display: true,
            text: 'Foo',
          },
          ticks: {
            stepSize: 1,
            color: 'green',
            format: { maximumSignificantDigits: 2 },
          },
          bounds: 'data',
        },
      },

      plugins: {
        legend: {
          display: false,
          labels: {
            filter: function (item, chart) {
              // Logic to remove a particular legend item goes here
              return item.text !== undefined;
            },
          },
        },

        tooltip: {
          mode: 'point',
          enabled: false,
        },
      },
    },
  };
}
