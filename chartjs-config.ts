import {
  ChartConfiguration,
  ChartDataset,
  ChartEvent,
  Point,
} from 'chart.js/auto';
import { ChartData } from './chart-data';

export function createDataset(
  chartData: ChartData,
  color?: string
): ChartDataset {
  return {
    data: chartData.points,
    borderWidth: 2,
    borderColor: color ?? '#ff0016',
    hidden: false,
    fill: false,
    radius: 0,
    tension: 0,
    animation: false,
  };
}

export function getChartConfig(
  ...dataSets: ChartDataset[]
): ChartConfiguration {
  return {
    type: 'line',
    data: {
      datasets: dataSets,
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
            major: { enabled: true },
            autoSkip: false,
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
