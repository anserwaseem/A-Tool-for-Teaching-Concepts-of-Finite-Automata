import { RowModel, DraggableStateModel, TransitionModel } from "../../models";

export type AutomataData = {
  rows: RowModel[];
  states: DraggableStateModel[];
  transitions: TransitionModel[];
};
