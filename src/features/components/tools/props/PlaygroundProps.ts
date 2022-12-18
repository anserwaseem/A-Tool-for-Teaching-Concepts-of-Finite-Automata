import {
  DraggableStateModel,
  TransitionModel,
  RowModel,
} from "../../../../models";

export type ToolsPlaygroundProps = {
  states: DraggableStateModel[];
  transitions: TransitionModel[];
  canvasWidth?: number | string;
  currentStates?: string[];
  stateSize?: number;
};
