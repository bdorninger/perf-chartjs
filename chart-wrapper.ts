import { ChartConfiguration } from 'chart.js';
import Chart, {
  BubbleDataPoint,
  ChartDataset,
  ChartTypeRegistry,
  Point,
  ScatterDataPoint,
} from 'chart.js/auto';
import { ChartData } from './chart-data';
import { createDataset, getChartConfig } from './chartjs-config';

export interface ChartWrapper<CT, DST, PT> {
  readonly numberOfDatasets: number;
  readonly chart: CT;
  addDataset(dataset: DST): number;
  clearDatasets(): void;
  updateChart(): void;
  setDatasetData(datasetIndex: number, data: ChartData<PT>): void;
  getAddDataSetHandler(allChartsData: ChartData<PT>[]): (ev: MouseEvent) => any;
}

export function makeChart(
  type: 'chartjs' | 'echarts',
  ctx: CanvasRenderingContext2D  
): ChartWrapper<any, any, any> | undefined {
  return type === 'chartjs'
    ? ChartJSWrapper.makeChart(ctx, getChartConfig())
    : undefined;
}

/**
 *
 */
export class ChartJSWrapper
  implements ChartWrapper<Chart, ChartDataset, Point>
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

  public getAddDataSetHandler(allChartData: ChartData[]) {
    const wrapper = this;
    return (ev: MouseEvent) => {
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
