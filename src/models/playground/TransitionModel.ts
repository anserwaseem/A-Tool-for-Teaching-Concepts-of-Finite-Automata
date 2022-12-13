type TransitionModelLabels = {
  start?: JSX.Element | string;
  middle?: JSX.Element | string;
  end?: JSX.Element | string;
};

type TransitionModelProps = {
  start: string;
  end: string;
  labels?: TransitionModelLabels | JSX.Element | string; //transitionValue: a, b or ^
  value?: string; //transitionValue: a, b or ^ (using to store label here too in case labels is a JSX.Element)
  path?: "smooth" | "grid" | "straight";
  color?: string;
  lineColor?: string;
  strokeWidth?: number;
  headSize?: number;
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
};

export default class TransitionModel {
  strokeWidth?: number;
  constructor(
    public start: string,
    public end: string,
    public labels?: TransitionModelLabels | JSX.Element | string, //transitionValue: a, b or ^
    public value?: string, //transitionValue: a, b or ^ (using to store label here too in case labels is a JSX.Element)
    public path?: "smooth" | "grid" | "straight",
    public color?: string,
    public lineColor?: string,
    strokeWidth?: number,
    public headSize?: number,
    public dashness?:
      | boolean
      | {
          strokeLen?: number;
          nonStrokeLen?: number;
          animation?: boolean | number;
        },
    public animateDrawing?: boolean | number,
    // for self-transitions
    public _extendSVGcanvas?: number,
    public _cpx1Offset?: number,
    public _cpy1Offset?: number,
    public _cpx2Offset?: number,
    public _cpy2Offset?: number
  ) {
    this.strokeWidth = strokeWidth ?? 4;
  }
}
