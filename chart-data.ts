import { Point } from 'chart.js/auto';

export class ChartData {
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

  //
  public clear() {
    this._points = [];
  }
}
