type TransitionModelLabels = {
  start: JSX.Element | string;
  middle: JSX.Element | string;
  end: JSX.Element | string;
};

type TransitionModelProps = {
  start: string;
  end: string;
  value: string; //transitionValue: a, b or ^
  labels?: TransitionModelLabels | JSX.Element | string;
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
};

export default class TransitionModel {
  constructor(
    public menuWindowOpened: boolean,
    public props: TransitionModelProps
  ) {}
}
