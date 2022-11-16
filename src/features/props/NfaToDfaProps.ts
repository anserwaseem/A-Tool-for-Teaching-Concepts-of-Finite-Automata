import { RowModel, DraggableStateModel, TransitionModel } from "../../models";

export type NfaToDfaProps = {
  rows: RowModel[];
  states: DraggableStateModel[];
  transitions: TransitionModel[];
};
