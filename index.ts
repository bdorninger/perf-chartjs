// Import stylesheets

import { ChartData } from './chart-data';
import { makeChart } from './chart-wrapper';
import './style.css';

let fillInterval = 100;
let x = 0;
let paintJobHandle = undefined;
let allChartData: ChartData<any>[] = [];

const ctx = (
  document.getElementById('myChart') as HTMLCanvasElement
).getContext('2d');

const chart = makeChart('chartjs', ctx);

const interval = document.getElementById('xInterval') as HTMLInputElement;
interval.valueAsNumber = fillInterval;

interval.addEventListener('change', (ev) => {
  ev.preventDefault();
  const val = (ev.target as HTMLInputElement).valueAsNumber;
  if (!isNaN(val)) {
    fillInterval = val;
  }
});

const addBt = document.getElementById('btAdd') as HTMLButtonElement;

addBt.addEventListener('click', (ev) => {
  const hdl = chart.getAddDataSetHandler(allChartData);
  hdl(ev);
  updateDatasetnumber();
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
  updateDatasetnumber();
});

function updateDatasetnumber() {
  const numCurves = document.getElementById('numCurves') as HTMLInputElement;
  numCurves.valueAsNumber = chart.numberOfDatasets;
}

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
