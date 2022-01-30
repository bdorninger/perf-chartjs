import {
  DatasetComponentOption,
  GridComponentOption,
  LineSeriesOption,
} from 'echarts';

export type ECOption = echarts.ComposeOption<
  LineSeriesOption | GridComponentOption | DatasetComponentOption
>;

// Specify the configuration items and data for the chart
export const option: ECOption = {
  
  grid: {
    top: '8%',
    bottom: '12%',
  },
  xAxis: {
    animation: false,
    type: 'value',
    interval: 0.5,
    axisTick: {
      show: true,
    },
    axisLine: { onZero: true },
    scale: true,
  },
  yAxis: {
    animation: false,
    min: 0,
    max: 20,
    type: 'value',
    interval: 2,
    axisLine: { onZero: true },
  },
  /*series: [
    {
      type: 'line',
      animation: false,
      smooth: false,
      symbolSize: 10,
      data: [
        [3, 4],
        [10, 16],
        [11, 17],
      ],
    },
  ],*/
};

export function randomEchartColor(): string {
  const r = parseInt((Math.random() * 255).toFixed(0)).toString(16);
  const b = parseInt((Math.random() * 255).toFixed(0)).toString(16);
  const g = parseInt((Math.random() * 255).toFixed(0)).toString(16);
  const col = `#${r}${b}${g}`;
  return col;
}

export function getEchartOptions(...datasets: number[][]): ECOption {
  return option;
}
