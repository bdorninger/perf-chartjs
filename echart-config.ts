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
    type: 'value',
    axisTick: {
      show: true,
      interval: 'auto',
    },
    axisLine: { onZero: false },
  },
  yAxis: {
    min: 0,
    max: 20,
    type: 'value',
    axisTick: {
      show: true,
      interval: 2,
    },
    axisLine: {},
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

export function getEchartOptions(...datasets: number[][]): ECOption {
  return option;
}
