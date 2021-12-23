// Import stylesheets

// import color from '@kurkle/color';
import colorLib from '@kurkle/color';
import Chart from 'chart.js/auto';
import { ChartData } from './chart-data';
import { ChartJSWrapper } from './chart-wrapper';
import { createDataset, getChartConfig } from './chartjs-config';
import './style.css';

let fillInterval = 100;
let x = 0;
let paintJobHandle = undefined;
let allChartData: ChartData[] = [];

const ctx = (
  document.getElementById('myChart') as HTMLCanvasElement
).getContext('2d');

const chart = ChartJSWrapper.makeChart(ctx, getChartConfig()); // data.points

const interval = document.getElementById('xInterval') as HTMLInputElement;
interval.valueAsNumber = fillInterval;

interval.addEventListener('change', (ev) => {
  ev.preventDefault();

  const val = (ev.target as HTMLInputElement).valueAsNumber;
  console.log(`interval changed to ${val}`);

  if (!isNaN(val)) {
    fillInterval = val;
  }
});

const addBt = document.getElementById('btAdd') as HTMLButtonElement;
addBt.addEventListener('click', (ev) => {
  const data = new ChartData();
  const newDataset = createDataset(
    data,
    colorLib([
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
    ]).rgbString()
  );

  chart.addDataset(newDataset);
  allChartData.push(data);
  console.log(`Added set ${chart.numberOfDatasets}`);
});

const startBt = document.getElementById('btStart') as HTMLButtonElement;
const stopBt = document.getElementById('btStop') as HTMLButtonElement;
startBt.addEventListener('click', (ev) => {
  if (paintJobHandle === undefined) {
    console.log(`Starting paint`);
    x = 0;
    paintJobHandle = fillContinuously();
    stopBt.disabled = false;
    startBt.disabled = true;
  }
});

stopBt.addEventListener('click', (ev) => {
  if (paintJobHandle !== undefined) {
    console.log(`Stopping paint`);
    clearInterval(paintJobHandle);
    paintJobHandle = undefined;
    startBt.disabled = false;
    stopBt.disabled = true;
  }
});

const clearBt = document.getElementById('btClear') as HTMLButtonElement;
clearBt.addEventListener('click', (ev) => {
  allChartData = [];
  chart.clearDatasets();
  chart.updateChart();
});

function fillContinuously() {
  const gap = 0.1;
  const yoffs = 0.5;

  const hdl = setInterval(() => {
    allChartData.forEach((cd, i) => {
      const y = Math.abs(15 * Math.sin(Math.PI * (x + i * 0.1)) + yoffs);
      cd.addPoint({ x: x, y: y });
      chart.setDatasetData(i, cd);
    });
    x = x + gap;
    chart.updateChart();
  }, fillInterval);
  return hdl;
}
