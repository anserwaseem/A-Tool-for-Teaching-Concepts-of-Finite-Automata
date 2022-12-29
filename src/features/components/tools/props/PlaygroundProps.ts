import { DraggableStateModel, TransitionModel } from "../../../../models";

export type ToolsPlaygroundProps = {
  states: DraggableStateModel[];
  transitions: TransitionModel[];
  setTransitions: React.Dispatch<React.SetStateAction<TransitionModel[]>>;
  canvasWidth?: number | string;
  currentStates?: string[];
  stateSize?: number;
};
