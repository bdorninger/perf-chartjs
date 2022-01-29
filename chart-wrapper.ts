import { ChartConfiguration } from 'chart.js';
import Chart, {
  BubbleDataPoint,
  ChartDataset,
  ChartTypeRegistry,
  Point,
  ScatterDataPoint,
} from 'chart.js/auto';
import * as echarts from 'echarts/core';
import { ChartData } from './chart-data';
import { createDataset, getChartConfig } from './chartjs-config';
import { ECOption, getEchartOptions } from './echart-config';

import {
  GridComponent,
  // Dataset
  DatasetComponent,
  TransformComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { SeriesModel } from 'echarts/core';
import GlobalModel from 'echarts/types/src/model/Global';

export interface ChartWrapper<CT, DST, PT> {
  readonly numberOfDatasets: number;
  readonly chart: CT;
  addDataset(dataset: DST): number;
  clearDatasets(): void;
  updateChart(): void;
  destroy(): void;
  setDatasetData(datasetIndex: number, data: ChartData<PT>): void;
  getAddDataSetHandler(allChartsData: ChartData<PT>[]): (ev: MouseEvent) => any;
}

export function makeChart(
  type: 'chartjs' | 'echarts',
  region: HTMLDivElement
): ChartWrapper<any, any, any> | undefined {
  return type === 'chartjs'
    ? ChartJSWrapper.makeChart(region, getChartConfig())
    : EChartWrapper.makeChart(region, getEchartOptions());
}

export class EChartWrapper
  implements ChartWrapper<echarts.ECharts, number[][], number[]>
{
  public get numberOfDatasets(): number {
    return (this.chart as any).getModel().getSeriesCount();
  }

  public readonly chart: echarts.ECharts;

  public static makeChart(
    region: HTMLDivElement,
    options: ECOption
  ): EChartWrapper {
    echarts.use([
      GridComponent,
      DatasetComponent,
      TransformComponent,
      LineChart,
      CanvasRenderer,
    ]);

    const wrapper = new EChartWrapper(region);
    wrapper.chart.setOption(options);
    return wrapper;
  }

  constructor(region: HTMLDivElement) {
    this.chart = echarts.init(region);
  }

  public addDataset(dataset: number[][]): number {
    const currentCount = this.numberOfDatasets + 1;
    const opt: ECOption = {
      series: {
        id: currentCount.toString(),
        data: dataset,
        lineStyle: {
          color: '#0f0',
        },
      },
    };
    return currentCount;
  }

  public clearDatasets(): void {
    (this.chart as any).getModel().setSeries();
    const opt: ECOption = {
      series: {}, // empty series should remove all existing series
    };
    this.chart.setOption(opt);
  }

  public updateChart(): void {
    // echart has no explicit update
  }

  public destroy(): void {
    this.chart.dispose();
  }

  public setDatasetData(datasetIndex: number, data: ChartData<number[]>): void {
    const smodel: SeriesModel<any> = this.getChartModel().getSeriesByIndex(
      datasetIndex
    ) as unknown as SeriesModel<any>;
    const opt: ECOption = {
      series: [
        {
          id: smodel.id,
          data: data.points,
        },
      ],
    };
    this.chart.setOption(opt);
  }

  public getAddDataSetHandler(
    allChartData: ChartData<number[]>[]
  ): (ev: MouseEvent) => any {
    const wrapper = this;
    return (_ev: MouseEvent) => {
      const data = new ChartData<number[]>();
      const newDataset = data.points;

      this.addDataset(newDataset);
      allChartData.push(data);
      console.log(`Added set ${wrapper.numberOfDatasets}`);
    };
  }

  private getChartModel(): GlobalModel {
    return (this.chart as any).getModel();
  }
}

/**
 * CHART.JS wrapper
 */
export class ChartJSWrapper
  implements ChartWrapper<Chart, ChartDataset, Point>
{
  public static makeChart(region: HTMLDivElement, cfg: ChartConfiguration) {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    region.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, cfg);
    return new ChartJSWrapper(chart);
  }

  constructor(
    public readonly chart: Chart<
      keyof ChartTypeRegistry,
      (number | ScatterDataPoint | BubbleDataPoint)[],
      unknown
    >
  ) {
    //
  }

  public destroy(): void {
    this.chart.destroy();
  }

  public getAddDataSetHandler(allChartData: ChartData[]) {
    const wrapper = this;
    return (_ev: MouseEvent) => {
      const data = new ChartData<Point>();
      const newDataset = createDataset(data);

      this.addDataset(newDataset);
      allChartData.push(data);
      console.log(`Added set ${wrapper.numberOfDatasets}`);
    };
  }

  public get numberOfDatasets(): number {
    return this.chart.data.datasets.length;
  }

  public addDataset(dataset: ChartDataset) {
    return this.chart.data.datasets.push(dataset);
  }
  public clearDatasets() {
    this.chart.data.datasets = [];
  }
  public updateChart() {
    this.chart.update();
  }

  public setDatasetData(datasetIndex: number, data: ChartData<Point>) {
    this.chart.data.datasets[datasetIndex].data = [...data.points];
  }
}
