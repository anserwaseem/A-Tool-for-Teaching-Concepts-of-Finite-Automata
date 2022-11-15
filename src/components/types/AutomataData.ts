import { RowModel, DraggableStateModel, TransitionModel } from "../../models";

export type AutomataData = {
  rowId: number;
  setRowId: React.Dispatch<React.SetStateAction<number>>;
  rows: RowModel[];
  setRows: React.Dispatch<React.SetStateAction<RowModel[]>>;
  states: DraggableStateModel[];
  setStates: React.Dispatch<React.SetStateAction<DraggableStateModel[]>>;
  transitions: TransitionModel[];
  setTransitions: React.Dispatch<React.SetStateAction<TransitionModel[]>>;
};
