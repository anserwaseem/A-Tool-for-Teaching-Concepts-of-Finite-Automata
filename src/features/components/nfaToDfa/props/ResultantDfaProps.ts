import {
  DraggableStateModel,
  RowModel,
  TransitionModel,
} from "../../../../models";

export type ResultantDfaProps = {
  rows: RowModel[];
  states: DraggableStateModel[];
  transitions: TransitionModel[];
  setIsResultantDfaComplete: React.Dispatch<React.SetStateAction<boolean>>;
};
