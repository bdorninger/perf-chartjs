import { ChartConfiguration } from 'chart.js';
import Chart, {
  BubbleDataPoint,
  ChartDataset,
  ChartTypeRegistry,
  ScatterDataPoint,
} from 'chart.js/auto';
import { ChartData } from './chart-data';

export interface ChartWrapper<CT, DST, CFT> {
  readonly numberOfDatasets: number;
  readonly chart: CT;
  addDataset(dataset: DST): number;
  clearDatasets(): void;
  updateChart(): void;
  setDatasetData(datasetIndex: number, data: ChartData): void;
}

/**
 *
 */
export class ChartJSWrapper
  implements ChartWrapper<Chart, ChartDataset, ChartConfiguration>
{
  public static makeChart(
    ctx: CanvasRenderingContext2D,
    cfg: ChartConfiguration
  ) {
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

  public setDatasetData(datasetIndex: number, data: ChartData) {
    this.chart.data.datasets[datasetIndex].data = [...data.points];
  }
}
