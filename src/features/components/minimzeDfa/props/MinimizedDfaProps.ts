import {
  RowModel,
  DraggableStateModel,
  TransitionModel,
} from "../../../../models";
import { EquivalentStatesRowModel } from "../../../../models/minimizeDfa/EquivalentStatesRowModel";

export type MinimizedDfaProps = {
  rows: RowModel[];
  states: DraggableStateModel[];
  transitions: TransitionModel[];
  equivalentStatesRows: EquivalentStatesRowModel[];
  setIsMinimizedDfaComplete: React.Dispatch<React.SetStateAction<boolean>>;
};
