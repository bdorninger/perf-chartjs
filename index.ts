// Import stylesheets
import { Point } from 'chart.js';
import Chart from 'chart.js/auto';
import { getChartConfig } from './chart-config';
import './style.css';

let fillInterval = 500;

class ChartData {
  private _points: Point[] = [];

  public get points(): Point[] {
    return this._points;
  }

  public addPoint(p: Point) {
    this._points.push(p);
    if (this._points.length > 50) {
      this._points.shift();
    }
  }

  public clear() {
    this._points = [];
  }
}

const ctx = (
  document.getElementById('myChart') as HTMLCanvasElement
).getContext('2d');

const data = new ChartData();

const chart = new Chart(ctx, getChartConfig([])); // data.points

const startBt = document.getElementById('btStart') as HTMLButtonElement;

const interval = document.getElementById('xInterval') as HTMLInputElement;
interval.valueAsNumber=fillInterval;

let intervalHdl: any;

interval.addEventListener('change', ev => {
  ev.preventDefault();
  
  const val = (ev.target as HTMLInputElement).valueAsNumber;
  console.log(`interval changed to ${val}`)
  
  if(!isNaN(val)) {
    fillInterval = val
  }

  
})

startBt.addEventListener('click', (ev) => {
  console.log('Starting');
  data.clear();
  chart.data.datasets[0].data = [];

  intervalHdl = fillContinuously(
    chart,
    data,
    (x) => Math.abs(15 * Math.sin(x * Math.PI)) + 0.5
  );
});

const stopBt = document.getElementById('btStop') as HTMLButtonElement;

stopBt.addEventListener('click', (ev) => {
  if (intervalHdl !== undefined) {
    console.log('Stopping');
    clearInterval(intervalHdl);
  }
});

function fillContinuously(
  chart: Chart,
  data: ChartData,
  func: (x: number) => number
) {
  let x = 0;
  const hdl = setInterval(() => {
    const y = func(x);
    data.addPoint({ x: x, y: y });
    // console.log(`Added data x:${x} y:${y}`);
    chart.data.datasets[0].data = [...data.points];
    chart.update();
    x += 0.05;
  }, fillInterval);
  return hdl;
}
