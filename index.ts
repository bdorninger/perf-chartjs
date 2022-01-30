// Import stylesheets

import { ChartData } from './chart-data';
import { ChartWrapper, makeChart } from './chart-wrapper';
import './style.css';

let cWrapper: ChartWrapper<any, any, any> | undefined;
const chartRegion = document.getElementById('chartRegion') as HTMLDivElement;

const chartSelect = document.getElementById('chartType') as HTMLSelectElement;
chartSelect.selectedIndex = -1;
chartSelect.addEventListener('change', (ev: any) => {
  if (cWrapper !== undefined) {
    cWrapper.destroy();
    // should reset the DOM (remove all listeners, re init default values), reset possibly running counter,......
    location.reload(); // I'll go the easy way: reloading resets the whole DOM
    cWrapper = undefined;
    return;
  }
  const val = ev.target.options[ev.target.selectedIndex].value;
  document.getElementById('chartSpace').classList.remove('chart-hidden');
  //chartSelect.disabled = true;
  cWrapper = initialize();
});

function initialize(): ChartWrapper<any, any, any> {
  let fillInterval = 100;
  let x = 0;
  let paintJobHandle = undefined;
  let allChartData: ChartData<any>[] = [];
  console.log(chartSelect.value);
  const chartWrapper = makeChart(chartSelect.value as any, chartRegion);

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
    const hdl = chartWrapper.getAddDataSetHandler(allChartData);
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
    chartWrapper.clearDatasets();
    chartWrapper.updateChart();
    updateDatasetnumber();
  });

  function updateDatasetnumber() {
    const numCurves = document.getElementById('numCurves') as HTMLInputElement;
    numCurves.valueAsNumber = chartWrapper.numberOfDatasets;
  }

  function fillContinuously() {
    const gap = 0.1;
    const yoffs = 0.5;

    const hdl = setInterval(() => {
      allChartData.forEach((cd, i) => {
        const y = Math.abs(15 * Math.sin(Math.PI * (x + i * 0.1)) + yoffs);

        cd.addPoint(chartWrapper.createPoint(x, y));
        chartWrapper.setDatasetData(i, cd);
      });
      x = x + gap;
      chartWrapper.updateChart();
    }, fillInterval);
    return hdl;
  }

  return chartWrapper;
}
