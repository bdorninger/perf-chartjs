export class ChartData<PT = unknown> {
  private _points: PT[] = [];

  public get points(): PT[] {
    return this._points;
  }

  public addPoint(p: PT) {
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
