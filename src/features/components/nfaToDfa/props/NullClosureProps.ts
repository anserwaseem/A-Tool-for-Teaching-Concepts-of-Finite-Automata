import {
  DraggableStateModel,
  RowModel,
  TransitionModel,
} from "../../../../models";

export type NullClosureProps = {
  rows: RowModel[];
  states: DraggableStateModel[];
  transitions: TransitionModel[];
};
