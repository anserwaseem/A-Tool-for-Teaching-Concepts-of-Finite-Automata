import {
  DraggableStateModel,
  TransitionModel,
  RowModel,
} from "../../../../models";

export type ToolsPlaygroundProps = {
  states: DraggableStateModel[];
  setStates: React.Dispatch<React.SetStateAction<DraggableStateModel[]>>;
  transitions: TransitionModel[];
  setTransitions: React.Dispatch<React.SetStateAction<TransitionModel[]>>;
  rows: RowModel[];
  setRows: React.Dispatch<React.SetStateAction<RowModel[]>>;
};
