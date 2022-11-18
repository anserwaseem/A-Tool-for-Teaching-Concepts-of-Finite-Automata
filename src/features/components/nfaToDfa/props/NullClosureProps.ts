import {
  DraggableStateModel,
  RowModel,
  TransitionModel,
} from "../../../../models";

export type NullClosureProps = {
  rows: RowModel[];
  setRows: React.Dispatch<React.SetStateAction<RowModel[]>>;
  states: DraggableStateModel[];
  setStates: React.Dispatch<React.SetStateAction<DraggableStateModel[]>>;
  transitions: TransitionModel[];
  setTransitions: React.Dispatch<React.SetStateAction<TransitionModel[]>>;
  setIsNullClosureTableComplete: React.Dispatch<React.SetStateAction<boolean>>;
};
