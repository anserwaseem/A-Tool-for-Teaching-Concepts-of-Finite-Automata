type TransitionModelLabels = {
  start?: JSX.Element | string;
  middle?: JSX.Element | string;
  end?: JSX.Element | string;
};

export default class TransitionModel {
  start: string;
  end: string;
  labels?: TransitionModelLabels | JSX.Element | string; //transitionValue: a, b or ^
  value?: string; //transitionValue: a, b or ^ (using to store label here too in case labels is a JSX.Element)
  strokeWidth?: number;
  color?: string;
  lineColor?: string;
  dashness?:
    | boolean
    | {
        strokeLen?: number;
        nonStrokeLen?: number;
        animation?: boolean | number;
      };
  animateDrawing?: boolean | number;
  // for self-transitions
  _extendSVGcanvas?: number;
  _cpx1Offset?: number;
  _cpy1Offset?: number;
  _cpx2Offset?: number;
  _cpy2Offset?: number;

  constructor({
    start,
    end,
    labels,
    value,
    strokeWidth,
    color,
    dashness,
    animateDrawing,
    _extendSVGcanvas,
    _cpx1Offset,
    _cpy1Offset,
    _cpx2Offset,
    _cpy2Offset,
  }: {
    start: string;
    end: string;
    labels?: TransitionModelLabels | JSX.Element | string; //transitionValue: a, b or ^
    value?: string; //transitionValue: a, b or ^ (using to store label here too in case labels is a JSX.Element)
    strokeWidth?: number;
    color?: string;
    dashness?:
      | boolean
      | {
          strokeLen?: number;
          nonStrokeLen?: number;
          animation?: boolean | number;
        };
    animateDrawing?: boolean | number;
    // for self-transitions
    _extendSVGcanvas?: number;
    _cpx1Offset?: number;
    _cpy1Offset?: number;
    _cpx2Offset?: number;
    _cpy2Offset?: number;
  }) {
    this.start = start;
    this.end = end;
    this.labels = labels ?? "";
    this.value = value ?? "";
    this.strokeWidth = strokeWidth ?? 4;
    this.color = color;
    this.dashness = dashness ?? false;
    this.animateDrawing = animateDrawing ?? false;
    this._extendSVGcanvas = _extendSVGcanvas ?? 0;
    this._cpx1Offset = _cpx1Offset ?? 0;
    this._cpy1Offset = _cpy1Offset ?? 0;
    this._cpx2Offset = _cpx2Offset ?? 0;
    this._cpy2Offset = _cpy2Offset ?? 0;
  }
}
